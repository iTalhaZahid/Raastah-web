import FeaturesPage from "@/components/FeaturesPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Raastah Features | Find and Share Campus Rides",
  description:
    "Explore Raastah features for finding campus rides, saving destinations, scheduling trips, comparing offers, and coordinating with ride companions.",
  path: "/features",
  keywords: ["Raastah app features", "schedule campus rides", "find student rides"],
});

export default FeaturesPage;
