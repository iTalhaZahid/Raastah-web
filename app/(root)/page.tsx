import LandingPage from "@/components/Home/LandingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Raastah | Student Campus Rides Made Simple",
  description:
    "Find, offer, and schedule campus rides with verified students going your way. Share the journey with your university community.",
  path: "/",
  keywords: ["student rides", "campus rides", "university carpool", "shared rides"],
});

export default LandingPage;
