import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Raastah",
  description: "Placeholder privacy policy for Raastah.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 pb-16 pt-36 text-white sm:px-6 md:pt-44">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-[#d4ff00]">Raastah Legal</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-zinc-400">Last updated: September 5, 2026</p>
        <p className="mt-8 rounded-2xl border border-[#d4ff00]/20 bg-[#d4ff00]/5 p-5 text-sm leading-6 text-zinc-300">
          This page contains dummy content for demonstration purposes. It does not describe the actual data practices of Raastah.
        </p>
        <div className="mt-10 space-y-8 text-base leading-7 text-zinc-300">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">1. Information collected</h2>
            <p>In this example, a student ride-sharing service may collect profile details such as a name, email address, university, and ride preferences. Sample trip information includes pickup points, destinations, and ride history.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">2. How information is used</h2>
            <p>Example uses include matching riders, coordinating trips, sending ride updates, and responding to support requests. These examples are provided only to demonstrate the layout of a privacy policy.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">3. Location and device information</h2>
            <p>A sample ride service may request location access to suggest nearby rides or display a pickup point. Device permissions can be managed in device settings. Any actual location or analytics practices will be described in the final policy.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">4. Sharing information</h2>
            <p>In a sample trip, relevant profile and pickup details may be visible to other ride participants. The final policy will explain which information is shared, with whom, and for what purposes.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">5. Retention and your choices</h2>
            <p>Example privacy controls include updating a profile, adjusting permissions, and requesting account deletion. Actual retention periods and available controls will be detailed before this placeholder is replaced.</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">6. Contact</h2>
            <p>For this demo, the example contact address is privacy@example.com. This is a placeholder, not a monitored Raastah privacy address.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
