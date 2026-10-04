import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy | Raastah",
  description: "Learn how Raastah collects, uses, stores, and protects personal information.",
  path: "/privacy-policy",
  keywords: ["Raastah privacy policy", "personal data", "student ride sharing privacy"],
});

export default PrivacyPolicyContent;
