import type { Metadata } from "next";
import UniversityEmailVerificationPage from "@/components/UniversityEmailVerificationPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Verify University Email | Raastah",
  description: "Verify the university email linked to your Raastah account.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default UniversityEmailVerificationPage;
