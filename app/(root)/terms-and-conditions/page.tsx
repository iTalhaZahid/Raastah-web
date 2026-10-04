import TermsAndConditionsContent from "@/components/TermsAndConditionsContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms and Conditions | Raastah",
  description: "Read the terms that apply when you use Raastah and arrange rides through the platform.",
  path: "/terms-and-conditions",
  keywords: ["Raastah terms", "campus ride sharing terms", "ride platform terms"],
});

export default TermsAndConditionsContent;
