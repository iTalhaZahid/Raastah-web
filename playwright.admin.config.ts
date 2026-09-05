import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "admin.spec.ts",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3101", trace: "off" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --port 3101 --hostname 127.0.0.1",
    url: "http://127.0.0.1:3101/admin",
    env: { NEXT_PUBLIC_API_URL: "http://127.0.0.1:4318", NEXT_DIST_DIR: ".next-admin-test" },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
