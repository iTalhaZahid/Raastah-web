import { FadeUp } from "@/components/magicui/fade-up";
import { TextShimmer } from "@/components/magicui/text-shimmer";
import Image from "next/image";

function Hero() {
    return (
        <section id="home" className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505] pb-0 pt-32 text-white selection:bg-[#d4ff00]/30">

            <div className="container max-w-6xl mx-auto px-6 md:px-12 text-center relative z-10 flex flex-col items-center">

                <FadeUp delay={0.1}>
                    <h1 className="mx-auto  max-w-5xl text-center text-[48px] font-extrabold leading-[0.95] tracking-[-0.06em] sm:text-6xl md:mb-6 md:text-7xl lg:text-[96px]">
                        <span className="block text-white">Your Ride</span>
                        <span className="block">
                            <TextShimmer className="drop-shadow-[0_0_24px_rgba(212,255,0,0.35)]">
                                Secured
                            </TextShimmer>
                            <span className="text-white"> in Seconds</span>
                        </span>
                    </h1>
                </FadeUp>
                <FadeUp delay={0.2}>
                    <p className="mx-auto mb-6 max-w-2xl text-center text-sm font-medium leading-relaxed text-[#9d9d9d] sm:text-base md:text-lg">
                        Connect with trusted Students through verified rides making every trip safer, faster, and stress-free.
                    </p>
                </FadeUp>

                <div className="relative mt-8 h-[350px] w-full max-w-4xl mx-auto mb-8 sm:-mb-16 md:-mb-24 sm:-mt-2 sm:h-[450px] md:h-[600px]">

                    {/* Left Phone (Booking) */}
                    <FadeUp delay={0.5} className="absolute left-[2%] sm:left-[12%] lg:left-[16%] top-[15%] sm:top-[12%] w-[38%] sm:w-[28%] aspect-[1/2] z-10 -rotate-[15deg] group cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:-rotate-[10deg] group-hover:scale-105 group-hover:z-40 rounded-[2rem] sm:rounded-[2.5rem] border-[10px] sm:border-[10px] border-[#1a1a1a] bg-black overflow-hidden shadow-2xl">
                            {/* Dynamic Island */}
                            {/* <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[35%] h-[3%] sm:h-5 bg-[#1a1a1a] rounded-full z-50"></div> */}
                            <Image
                                src="/5.png"
                                alt="Booking Screen"
                                fill
                                sizes="(max-width: 768px) 40vw, 30vw"
                                className="object-cover opacity-90 transition-opacity hover:opacity-100"
                            />
                        </div>
                    </FadeUp>

                    {/* Right Phone (Completed) */}
                    <FadeUp delay={0.6} className="absolute right-[2%] sm:right-[12%] lg:right-[16%] top-[15%] sm:top-[12%] w-[38%] sm:w-[28%] aspect-[1/2] z-10 rotate-[15deg] group cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-105 group-hover:z-40 rounded-[2rem] sm:rounded-[2.5rem] border-[10px] sm:border-[10px] border-[#1a1a1a] bg-black overflow-hidden shadow-2xl">
                            {/* Dynamic Island */}
                            {/* <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[35%] h-[3%] sm:h-5 bg-[#1a1a1a] rounded-full z-50"></div> */}
                            <Image
                                src="/6.png"
                                alt="Ride Completed Screen"
                                fill
                                sizes="(max-width: 768px) 40vw, 30vw"
                                className="object-cover opacity-90 transition-opacity hover:opacity-100"
                            />
                        </div>
                    </FadeUp>

                    {/* Center Phone (Welcome) */}
                    <FadeUp delay={0.3} className="absolute left-1/2 -translate-x-1/2 top-0 w-[50%] sm:w-[35%] aspect-[1/2] z-30 group cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:-translate-y-4 rounded-[2rem] sm:rounded-[2.5rem] border-[10px] sm:border-[10px] border-[#1a1a1a] bg-black overflow-hidden shadow-[0_0_50px_rgba(212,255,0,0.15)] ring-1 ring-white/10">
                            {/* Dynamic Island */}
                            {/* <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[35%] h-[3%] sm:h-5 bg-[#1a1a1a] rounded-full z-50"></div> */}
                            <Image
                                src="/4.png"
                                alt="Welcome Screen"
                                fill
                                sizes="(max-width: 768px) 55vw, 40vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </FadeUp>
                </div>
            </div>
        </section>
    )
}

export default Hero
