import Hero from "@/components/Home/Hero";
import Proof from "@/components/Home/sections/Proof";
import Problem from "@/components/Home/sections/Problem";
import Solution from "@/components/Home/sections/Solution";
import HowItWorks from "@/components/Home/sections/HowItWorks";
import FAQ from "@/components/Home/sections/FAQ";
import CTA from "@/components/Home/sections/CTA";

export default function LandingPage() {
  return (
    <main id="main-content" className="landing">
      <Hero />
      <Proof />
      <Problem />
      <Solution />
      <HowItWorks />
      <FAQ />
      <CTA />
    </main>
  );
}
