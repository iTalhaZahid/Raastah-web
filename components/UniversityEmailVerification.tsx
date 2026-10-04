"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError, request, type UniversityEmailFields } from "@/lib/admin-api";

type Profile = UniversityEmailFields & { email?: string; verificationStatus: string; onboardingCompleted?: boolean };
const button = "min-h-11 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-[#333333] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4";
const recovery: Record<string, string> = {
  INVALID_VERIFICATION_TOKEN: "This link is invalid or has been replaced. Request a fresh email in the Raastah app.",
  VERIFICATION_TOKEN_EXPIRED: "This link has expired. Request a fresh email in the Raastah app.",
  VERIFICATION_TOKEN_USED: "This link has already been used. Check your profile or sign in; this does not confirm the current account is verified.",
  VERIFICATION_CHANGED: "Your verification state has changed. Check your profile and request a fresh email in the app if needed.",
  VERIFICATION_CONFLICT: "This email could not be linked. Check your profile and contact support or use student card verification in the app.",
  STUDENT_VERIFICATION_INELIGIBLE: "This account is not eligible for university email verification. Contact support in the app.",
  ALREADY_VERIFIED: "The account is already verified. Check your profile; identity changes require staff assistance.",
};

export default function Verification() {
  const token = useRef<string | null>(null);
  const captured = useRef(false);
  const busy = useRef(false);
  const [state, setState] = useState("loading");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileMessage, setProfileMessage] = useState("");
  const [signedOut, setSignedOut] = useState(false);
  const [retryAt, setRetryAt] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    const url = new URL(window.location.href);
    const values = url.searchParams.getAll("token");
    // Retain the challenge only in this mounted component, never in history state.
    window.history.replaceState(null, "", url.pathname);
    token.current = values.length === 1 && /^[a-f0-9]{64}$/.test(values[0]) ? values[0] : null;
    setState(token.current ? "ready" : "invalid");
  }, []);

  useEffect(() => {
    if (!retryAt) return;
    const update = () => setSeconds(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);

  function rateLimit(error: unknown) {
    if (error instanceof ApiError && error.status === 429) {
      setRetryAt(Date.now() + error.retryAfter * 1000);
      setSeconds(Math.ceil(error.retryAfter));
    }
  }

  async function loadProfile() {
    setProfile(null);
    setProfileMessage("");
    try {
      const response = await request<{ success: boolean; data: { user: Profile } }>("/api/v1/user/me");
      if (!response.success || !response.data?.user) throw new Error();
      setProfile(response.data.user);
      setSignedOut(false);
    } catch (error) {
      rateLimit(error);
      setSignedOut(error instanceof ApiError && error.status === 401);
      setProfileMessage(error instanceof ApiError && error.status === 401
        ? "Sign in below or return to the Raastah app to check your account and request a fresh email."
        : "Could not check your profile. Try again later or check in the Raastah app.");
    }
  }

  async function checkProfile() {
    if (busy.current || Date.now() < retryAt) return;
    busy.current = true; setPending(true);
    try { await loadProfile(); } finally { busy.current = false; setPending(false); }
  }

  async function verify() {
    if (busy.current || !token.current || Date.now() < retryAt) return;
    busy.current = true; setPending(true); setMessage("");
    try {
      const response = await request<{ success: boolean }>(`/api/v1/user/university-email/verify?token=${encodeURIComponent(token.current)}`, { credentials: "omit", referrerPolicy: "no-referrer" });
      if (response?.success !== true) throw new Error();
      token.current = null;
      setState("success");
      await loadProfile();
    } catch (error) {
      rateLimit(error);
      if (error instanceof ApiError && error.code && recovery[error.code]) {
        token.current = null;
        setState("invalid"); setMessage(recovery[error.code]);
        if (["ALREADY_VERIFIED", "VERIFICATION_CHANGED"].includes(error.code)) await loadProfile();
      } else {
        setState("retry");
        setMessage(error instanceof ApiError && error.status === 429
          ? "Too many attempts. Wait before trying again."
          : "We could not confirm the result. The link may have been consumed. Check your profile before explicitly retrying.");
      }
    } finally { busy.current = false; setPending(false); }
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || Date.now() < retryAt) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    busy.current = true; setPending(true);
    try {
      await request("/api/auth/sign-in/email", { method: "POST", body: JSON.stringify({ email: fields.get("email"), password: fields.get("password"), rememberMe: false }) });
      await loadProfile();
    } catch (error) {
      rateLimit(error);
      setProfileMessage("Could not sign in. Check your credentials or try again later.");
    } finally {
      (form.elements.namedItem("password") as HTMLInputElement).value = "";
      busy.current = false; setPending(false);
    }
  }

  if (state === "loading") return <p role="status">Preparing verification…</p>;
  return <div className="space-y-5">
    <p role="status">{state === "success"
      ? "University email verified for the account that requested this link. Return to the Raastah app to continue; onboarding may still be required."
      : state === "invalid" ? message || "This verification link is missing or invalid. Request a fresh email in the Raastah app."
      : state === "ready" ? "Confirm below to verify the account that requested this email. Links expire after 20 minutes."
      : message}</p>
    {(state === "ready" || state === "retry") && <button className={button} disabled={pending || seconds > 0} onClick={verify}>{state === "retry" ? "Retry verification" : "Verify university email"}</button>}
    {pending && <p role="status">Please wait…</p>}
    {seconds > 0 && <p role="status">Try again in {seconds} seconds.</p>}
    {state !== "ready" && <>
      <button className={button} disabled={pending || seconds > 0} onClick={checkProfile}>Check my profile status</button>
      {profileMessage && <p role="status">{profileMessage}</p>}
      {profile && <p role="status">Current browser account{profile.email ? ` (${profile.email})` : ""}: {profile.verificationStatus === "VERIFIED" ? "student verification is current. Other ride access rules still apply." : "student verification is not current. Historical email verification does not grant ride access."} {!profile.onboardingCompleted && "Complete onboarding in the Raastah app."}</p>}
      {signedOut && <form onSubmit={signIn} className="space-y-4">
        <h2 className="text-xl font-semibold">Sign in to check your profile</h2>
        <label className="block">Email address<input className="mt-1 w-full rounded border p-3" name="email" type="email" autoComplete="username" required /></label>
        <label className="block">Password<input className="mt-1 w-full rounded border p-3" name="password" type="password" autoComplete="current-password" required /></label>
        <button className={button} disabled={pending || seconds > 0}>Sign in</button>
      </form>}
    </>}
    <p className="text-sm">Open Raastah on your phone to continue or request another email. No email is resent automatically.</p>
    <Link href="/" prefetch={false} className="block underline">Return to Raastah website</Link>
  </div>;
}
