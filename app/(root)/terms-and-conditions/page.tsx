import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Raastah",
  description: "Placeholder terms and conditions for Raastah.",
};

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 pb-16 pt-36 text-white sm:px-6 md:pt-44">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-[#d4ff00]">Raastah Legal</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Terms and Conditions</h1>
        <p className="mt-4 text-sm text-zinc-400">Last updated: September 5, 2026</p>
        <p className="mt-8 rounded-2xl border border-[#d4ff00]/20 bg-[#d4ff00]/5 p-5 text-sm leading-6 text-zinc-300">
          This page contains dummy content for demonstration purposes. It does not represent the final terms of Raastah.
        </p>
        <div className="mt-10 space-y-8 text-base leading-7 text-zinc-300">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">1. Using Raastah</h2>
            <p>In this example, Raastah helps students discover and coordinate shared rides. Users agree to use the service responsibly and provide accurate information when arranging a trip.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">2. Your account</h2>
            <p>You are responsible for keeping your account details secure and updating your profile when information changes. Accounts should only be used by the person who created them.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">3. Rides and community conduct</h2>
            <p>Confirm the pickup point, destination, timing, and any shared costs before a ride. Treat other users respectfully, follow traffic rules, and report inappropriate behavior through the app.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">4. Cancellations and availability</h2>
            <p>Plans can change. Let other participants know as soon as possible if you need to cancel. Ride availability and arrival estimates in this demonstration are illustrative and are not guaranteed.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">5. Changes to these terms</h2>
            <p>This placeholder may be replaced as the service develops. The updated date above indicates the latest revision of this sample page.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">6. Contact</h2>
            <p>For this demo, the example contact address is support@example.com. This is a placeholder, not a monitored Raastah support address.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
