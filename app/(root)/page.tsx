import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowRaastahWorks from "@/components/Home/HowRaastahWorks";
import TrackRideSection from "@/components/Home/TrackRideSection";
import DownloadSection from "@/components/Home/DownloadSection";

export default function Home() {
  return (
    <div className="bg-[#050505]">
      <Hero />
      <HowRaastahWorks />
      <TrackRideSection />
      <Features />
      <DownloadSection />
    </div>
  );
}
