import Verification from "@/components/UniversityEmailVerification";

export default function UniversityEmailVerificationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#C6C6C6] px-6 py-16 text-black">
      <section className="w-full max-w-lg space-y-6 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest">Raastah</p>
        <h1 className="text-3xl font-bold">Verify university email</h1>
        <Verification />
      </section>
    </main>
  );
}
