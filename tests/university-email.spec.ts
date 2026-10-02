import { expect, test } from "@playwright/test";

const token = "a".repeat(64);

test("public verification is explicit, strips token, protects headers and checks a different browser account", async ({ page }) => {
  let consumed = 0;
  let checked = 0;
  await page.route("**/api/v1/user/university-email/verify?*", async (route) => {
    consumed++;
    expect(new URL(route.request().url()).searchParams.get("token")).toBe(token);
    expect(route.request().headers().referer).toBeUndefined();
    await route.fulfill({ json: { success: true, message: "Verified" } });
  });
  await page.route("**/api/v1/user/me", async (route) => {
    checked++;
    await route.fulfill({ json: { success: true, data: { user: { email: "other@example.com", verificationStatus: "PENDING", universityEmailVerified: true, onboardingCompleted: true } } } });
  });
  const response = await page.goto(`/verify-university-email?token=${token}`);
  // Next dev overrides Cache-Control; production must send no-store.
  expect(response?.headers()["cache-control"]).toContain(process.env.PLAYWRIGHT_PRODUCTION ? "no-store" : "no-cache");
  expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
  await expect(page.getByRole("button", { name: "Verify university email", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/verify-university-email$/);
  expect(consumed).toBe(0);
  await page.getByRole("button", { name: "Verify university email", exact: true }).dblclick();
  await expect(page.getByText(/University email verified for the account/)).toBeVisible();
  await expect(page.getByText(/Current browser account/)).toContainText("student verification is not current");
  expect(consumed).toBe(1);
  expect(checked).toBe(1);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length, history.state])).toEqual([0, 0, null]);
  await page.reload();
  await expect(page.getByText(/link is missing or invalid/)).toBeVisible();
  expect(consumed).toBe(1);
});

test("missing, malformed, uppercase and duplicate challenges cannot be submitted", async ({ page }) => {
  for (const query of ["", "?token=bad", `?token=${token.toUpperCase()}`, `?token=${token}&token=${token}`]) {
    await page.goto(`/verify-university-email${query}`);
    await expect(page.getByText(/link is missing or invalid/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Verify university email", exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(/\/verify-university-email$/);
  }
});

test("ambiguous failure offers profile check before manual retry; used token never claims success", async ({ page }) => {
  let consumed = 0;
  await page.route("**/api/v1/user/university-email/verify?*", async (route) => {
    consumed++;
    if (consumed === 1) return route.abort("failed");
    await route.fulfill({ status: 400, json: { success: false, code: "VERIFICATION_TOKEN_USED", message: "Used" } });
  });
  await page.route("**/api/v1/user/me", (route) => route.fulfill({ status: 401, json: { success: false, message: "Sign in" } }));
  await page.goto(`/verify-university-email?token=${token}`);
  await page.getByRole("button", { name: "Verify university email", exact: true }).click();
  await expect(page.getByText(/link may have been consumed/)).toBeVisible();
  expect(consumed).toBe(1);
  await page.getByRole("button", { name: "Check my profile status" }).click();
  await expect(page.getByRole("heading", { name: "Sign in to check your profile" })).toBeVisible();
  await page.getByRole("button", { name: "Retry verification" }).click();
  await expect(page.getByText(/This link has already been used/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry verification" })).toHaveCount(0);
  expect(consumed).toBe(2);
});

test("rate limit disables retry until Retry-After without automatically consuming again", async ({ page }) => {
  let consumed = 0;
  await page.route("**/api/v1/user/university-email/verify?*", async (route) => {
    consumed++;
    await route.fulfill({ status: 429, headers: { "Retry-After": "2" }, json: { success: false, code: "RATE_LIMITED", message: "Wait" } });
  });
  await page.goto(`/verify-university-email?token=${token}`);
  await page.getByRole("button", { name: "Verify university email", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retry verification" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Retry verification" })).toBeEnabled();
  expect(consumed).toBe(1);
});

for (const [code, text] of [["VERIFICATION_TOKEN_EXPIRED", "This link has expired"], ["INVALID_VERIFICATION_TOKEN", "This link is invalid or has been replaced"]]) {
  test(`${code} offers fresh request without claiming success`, async ({ page }) => {
    await page.route("**/api/v1/user/university-email/verify?*", (route) => route.fulfill({ status: 400, json: { success: false, code, message: "Invalid" } }));
    await page.goto(`/verify-university-email?token=${token}`);
    await page.getByRole("button", { name: "Verify university email", exact: true }).click();
    await expect(page.getByText(text, { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry verification" })).toHaveCount(0);
  });
}

test("signed-out verification succeeds and sign-in refreshes authoritative profile without consuming again", async ({ page }) => {
  let signedIn = false;
  let consumed = 0;
  await page.route("**/api/v1/user/university-email/verify?*", (route) => {
    consumed++;
    return route.fulfill({ json: { success: true } });
  });
  await page.route("**/api/v1/user/me", (route) => route.fulfill(signedIn
    ? { json: { success: true, data: { user: { verificationStatus: "VERIFIED", onboardingCompleted: false } } } }
    : { status: 401, json: { success: false, message: "Sign in" } }));
  await page.route("**/api/auth/sign-in/email", (route) => {
    expect(route.request().postDataJSON()).toEqual({ email: "student@example.com", password: "test-password", rememberMe: false });
    signedIn = true;
    return route.fulfill({ json: { user: { id: "student" } } });
  });
  await page.goto(`/verify-university-email?token=${token}`);
  await page.getByRole("button", { name: "Verify university email", exact: true }).click();
  await expect(page.getByText(/University email verified for the account/)).toBeVisible();
  await page.getByLabel("Email address").fill("student@example.com");
  await page.getByLabel("Password").fill("test-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText(/Current browser account/)).toContainText("student verification is current");
  await expect(page.getByText(/Current browser account/)).toContainText("Complete onboarding");
  expect(consumed).toBe(1);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});
