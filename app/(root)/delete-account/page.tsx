import DeleteAccountContent from "@/components/DeleteAccountContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Delete Your Raastah Account",
  description: "Request deletion of your Raastah account and associated personal data by email, without opening or reinstalling the app.",
  path: "/delete-account",
  keywords: ["delete Raastah account", "Raastah data deletion"],
});

export default DeleteAccountContent;
