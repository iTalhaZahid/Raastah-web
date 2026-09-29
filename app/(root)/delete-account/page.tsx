import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account | Raastah",
  description: "Request deletion of your Raastah account and associated personal data without opening or reinstalling the app.",
};

const deletionEmail = "mailto:support@raastah.app?subject=Raastah%20Account%20Deletion%20Request";

export default function DeleteAccount() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 pb-16 pt-36 text-white sm:px-6 md:pt-44">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-[#d4ff00]">Raastah Legal</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Delete Account</h1>
        <p className="mt-6 text-base leading-7 text-zinc-300">
          This page is the public account-deletion resource for <strong>Raastah</strong>, including the Raastah mobile application available on Google Play. You can request deletion of your app account and associated personal data <strong>without reinstalling or opening the app</strong>.
        </p>

        <section aria-labelledby="web-request" className="mt-10 rounded-2xl border border-[#d4ff00]/25 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d4ff00]">Request deletion on the web</p>
          <h2 id="web-request" className="mt-5 text-2xl font-semibold">Email our support team</h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Tap the button below to open an email to <strong>support@raastah.app</strong> with the subject <em>Raastah Account Deletion Request</em>. Include the email address on your account so we can verify you are the account holder.
          </p>
          <a href={deletionEmail} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-[#d4ff00]/50 bg-[#d4ff00]/10 px-6 py-3 text-center font-semibold text-[#d4ff00] underline underline-offset-4 transition hover:bg-[#d4ff00]/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4ff00]">
            Request account deletion
          </a>
          <p className="mt-5 text-sm leading-6 text-zinc-400">
            Or email <a href={deletionEmail} className="text-[#d4ff00] underline underline-offset-4">support@raastah.app</a> with subject &quot;Raastah Account Deletion Request&quot;.
          </p>
        </section>

        <div className="mt-10 space-y-10 text-base leading-7 text-zinc-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
          <section aria-labelledby="what-happens-next">
            <h2 id="what-happens-next">What Happens Next</h2>
            <ul className="list-disc space-y-3 pl-6">
              <li>We verify that the request comes from the account holder (for example, by confirming control of the registered email).</li>
              <li>We process verified requests within <strong>14 business days</strong> (sooner when possible). You will receive email confirmation when deletion is complete.</li>
              <li>When we delete your Raastah account, we delete associated personal data except where we must retain information for legitimate reasons such as security, fraud prevention, dispute resolution, accounting, or legal compliance.</li>
            </ul>
          </section>
          <section aria-labelledby="delete-in-app">
            <h2 id="delete-in-app">Optional: Delete in the app</h2>
            <p>If you still have the Raastah app installed, you can also delete from <strong>Profile → Settings → Delete Account</strong>. The web request path above is available if you have uninstalled the app or cannot access it.</p>
          </section>
          <section aria-labelledby="retained-records">
            <h2 id="retained-records">What we may retain</h2>
            <p>Certain records may be retained for a limited period where required or permitted by law — for example, security and fraud logs needed for security purposes or information needed to resolve disputes. Material retention practices are described in our <a href="/privacy-policy" className="text-[#d4ff00] underline underline-offset-4">Privacy Policy</a>.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
