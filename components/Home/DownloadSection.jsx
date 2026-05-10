import { Download, Play } from "lucide-react";
import { FadeUp } from "@/components/magicui/fade-up";
import { TextShimmer } from "@/components/magicui/text-shimmer";

export default function DownloadSection() {
    return (
        <section id="download" className="relative overflow-hidden bg-[#050505] px-4 py-20 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <FadeUp delay={0.1}>
                    <div className="relative overflow-hidden rounded-[1rem] border border-[#d4ff00]/30 bg-[#d4ff00] px-6 py-10 text-black shadow-[0_0_60px_rgba(212,255,0,0.25)] sm:px-10 lg:px-14">
                        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                            <div className="flex items-center gap-5">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black/20">
                                    <Download className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        <TextShimmer className="text-black [background-image:linear-gradient(110deg,#0b0b0b,45%,#3a3a3a,55%,#0b0b0b)]">
                                            Ready to Ride Smarter?
                                        </TextShimmer>
                                    </h2>
                                    <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-black/70 sm:text-base">
                                        Join students using Raastah for safer, easier, and more
                                        reliable campus rides.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#"
                                    className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/85"
                                >
                                    <Play className="h-5 w-5 fill-white" />
                                    Google Play
                                </a>

                                <a
                                    href="#"
                                    className="inline-flex h-14 items-center justify-center rounded-xl border border-black/20 px-6 text-sm font-semibold text-black transition hover:bg-black/10"
                                >
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}