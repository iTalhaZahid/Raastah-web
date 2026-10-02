import type { Metadata } from "next";
import Verification from "./verification";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Verify university email | Raastah",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page() {
  return <main className="flex min-h-screen items-center justify-center bg-[#fff9e6] px-6 py-16 text-[#171717]">
    <section className="w-full max-w-lg space-y-6 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-widest">Raastah</p>
      <h1 className="text-3xl font-bold">Verify university email</h1>
      <Verification />
    </section>
  </main>;
}
