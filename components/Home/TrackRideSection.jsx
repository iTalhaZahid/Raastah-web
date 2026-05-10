import Image from "next/image";
import { Bell, MapPinned, Route } from "lucide-react";
import { FadeUp } from "@/components/magicui/fade-up";

const trackingFeatures = [
  {
    icon: Route,
    title: "Live Route Tracking",
    description: "See your driver’s live location during the ride.",
  },
  {
    icon: MapPinned,
    title: "Accurate ETAs",
    description: "Get real-time arrival updates before pickup.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay updated at every step of your journey.",
  },
];

export default function TrackRideSection() {
  return (
    <section id="safety" className="relative overflow-hidden bg-[#050505] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4ff00]/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeUp delay={0.1}>
          <div className="flex justify-center px-2 sm:px-6 lg:justify-start lg:px-8">
              <Image
                src="/9.png"
                alt="Raastah live tracking screen"
                width={320}
                height={640}
                className="h-auto w-[240px] sm:w-[280px] lg:w-[320px]"
                style={{ height: "auto",width: "auto" }}
              />
          </div>
        </FadeUp>

        <div>
          <FadeUp delay={0.15}>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#d4ff00]">
              Real-time Experience
            </p>

            <h2 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Track Ride
              <br />
              Reach On Time
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Live location tracking, accurate ETAs, and smooth navigation —
              all in one simple student ride app.
            </p>
          </FadeUp>

          <div className="mt-10 space-y-6">
            {trackingFeatures.map((item, index) => (
              <FadeUp key={item.title} delay={0.2 + index * 0.1}>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d4ff00]/30 bg-[#d4ff00]/10">
                    <item.icon className="h-6 w-6 text-[#d4ff00]" />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}