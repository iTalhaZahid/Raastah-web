import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowRaastahWorks from "@/components/Home/HowRaastahWorks";
import DownloadSection from "@/components/Home/DownloadSection";
import TrackRideSection from "@/components/Home/TrackRideSection";

export default function Home() {
  return (
    <>
      <Hero />
      <HowRaastahWorks />
      <TrackRideSection />
      <Features />
      <DownloadSection />
    </>
  );
}
