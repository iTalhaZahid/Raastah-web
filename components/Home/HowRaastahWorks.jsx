import { FadeUp } from "@/components/magicui/fade-up";
import { UserPlus, MapPin, Users, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Sign Up",
    description: "Verify your student email and ID to create an account.",
  },
  {
    icon: MapPin,
    title: "2. Choose Ride",
    description: "Enter your destination and find riders going your way.",
  },
  {
    icon: Users,
    title: "3. Confirm & Ride",
    description: "Confirm your ride, meet up, and enjoy a safe journey.",
  },
  {
    icon: Star,
    title: "4. Complete & Rate",
    description: "End the ride, leave a rating, and help build a trusted community.",
  },
];

export default function HowRaastahWorks() {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-[#050505] px-4 pb-24 pt-20 text-white sm:px-6 md:pt-24 lg:px-8">

      <div className="relative mx-auto max-w-7xl">
        <FadeUp delay={0.1}>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How Raastah Works
            </h2>
          </div>
        </FadeUp>

        <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-12 hidden border-t border-dashed border-white/15 lg:block" />

          {steps.map((step, index) => (
            <FadeUp key={step.title} delay={0.15 + index * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-[#d4ff00]/70 bg-[#0b0b0b] shadow-[0_0_35px_rgba(212,255,0,0.16)]">
                  <step.icon className="relative h-10 w-10 text-[#d4ff00]" />
                </div>

                <h3 className="mb-3 text-lg font-semibold tracking-tight text-white">
                  {step.title}
                </h3>

                <p className="mx-auto max-w-55 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}