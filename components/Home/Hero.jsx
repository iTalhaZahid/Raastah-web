import { FadeUp } from "@/components/magicui/fade-up";
import Image from "next/image";

function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-0 flex min-h-screen flex-col  bg-[#0a0a0a] text-white selection:bg-[#d4ff00]/30">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4ff00] rounded-full blur-[150px] opacity-[0.07] pointer-events-none"></div>

            <div className="container max-w-6xl mx-auto px-6 md:px-12 text-center relative z-10 flex flex-col items-center">

                <FadeUp delay={0.1}>
                    <h1 className="text-[40px] sm:text-6xl md:text-7xl lg:text-[80px] font-serif font-semibold tracking-tighter mb-4 md:mb-12 text-balance mx-auto leading-[1.05] sm:leading-[1.1] md:leading-[1.05]">
                        <span className="text-white">Smart, </span>
                        <span className="text-[#666666]">safe, and <br className="hidden sm:block" /></span>
                        <span className="text-[#666666]">fast </span>
                        <span className="text-[#b3b3b3]">rides just a <br className="hidden sm:block" /></span>
                        <span className="text-white">tap away</span>
                    </h1>
                </FadeUp>

                <div className="relative w-full max-w-4xl mx-auto mb-16 sm:-mb-32 md:-mb-48 mt-8 sm:-mt-2 h-[350px] sm:h-[450px] md:h-[600px]">

                    {/* Left Phone (Booking) */}
                    <FadeUp delay={0.5} className="absolute left-[2%] sm:left-[12%] lg:left-[16%] top-[15%] sm:top-[12%] w-[38%] sm:w-[28%] aspect-[1/2] z-10 -rotate-[15deg] group cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:-rotate-[10deg] group-hover:scale-105 group-hover:z-40 rounded-[2rem] sm:rounded-[2.5rem] border-[4px] sm:border-[8px] border-[#1a1a1a] bg-black overflow-hidden shadow-2xl">
                            {/* Dynamic Island */}
                            <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[35%] h-[3%] sm:h-5 bg-[#1a1a1a] rounded-full z-50"></div>
                            <Image
                                src="/booking.png"
                                alt="Booking Screen"
                                fill
                                sizes="(max-width: 768px) 40vw, 30vw"
                                className="object-cover opacity-90 transition-opacity hover:opacity-100"
                            />
                        </div>
                    </FadeUp>

                    {/* Right Phone (Completed) */}
                    <FadeUp delay={0.6} className="absolute right-[2%] sm:right-[12%] lg:right-[16%] top-[15%] sm:top-[12%] w-[38%] sm:w-[28%] aspect-[1/2] z-10 rotate-[15deg] group cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-105 group-hover:z-40 rounded-[2rem] sm:rounded-[2.5rem] border-[4px] sm:border-[8px] border-[#1a1a1a] bg-black overflow-hidden shadow-2xl">
                            {/* Dynamic Island */}
                            <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[35%] h-[3%] sm:h-5 bg-[#1a1a1a] rounded-full z-50"></div>
                            <Image
                                src="/completed.png"
                                alt="Ride Completed Screen"
                                fill
                                sizes="(max-width: 768px) 40vw, 30vw"
                                className="object-cover opacity-90 transition-opacity hover:opacity-100"
                            />
                        </div>
                    </FadeUp>

                    {/* Center Phone (Welcome) */}
                    <FadeUp delay={0.3} className="absolute left-1/2 -translate-x-1/2 top-0 w-[50%] sm:w-[35%] aspect-[1/2] z-30 group cursor-pointer">
                        <div className="relative w-full h-full transition-all duration-500 group-hover:-translate-y-4 rounded-[2rem] sm:rounded-[2.5rem] border-[4px] sm:border-[8px] border-[#1a1a1a] bg-black overflow-hidden shadow-[0_0_50px_rgba(212,255,0,0.15)] ring-1 ring-white/10">
                            {/* Dynamic Island */}
                            <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-[35%] h-[3%] sm:h-5 bg-[#1a1a1a] rounded-full z-50"></div>
                            <Image
                                src="/welcome.png"
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
