import Image from "next/image";
function DownloadSection() {
    return (
        <section className="relative xl:mt-28 md:pb-52 bg-[#F5C542] px-6 py-12 lg:h-260  xl:h-110  lg:px-16">
            <div className="mx-auto max-w-7xl ">
                {/* Left Content */}
                <div className="grid items-center gap-10 xl:grid-cols-2 xl:gap-16 lg:gap-0">
                    <div className="relative order-2 mx-auto h-90 w-full max-w-95 xl:order-1 lg:order lg:h-auto lg:max-w-none">
                        <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full sm:h-95 sm:w-95 md:top-37 xl:left-0 xl:-top-79.5 xl:h-135 xl:w-135 xl:translate-x-0 lg:top-60" style={{
                            background:
                                "radial-gradient(circle at 50% 15%, #FFF6C7 0%, #F8D85A 30%, #D99A00 62%, #6B3F00 100%)",
                        }}>
                            <Image
                                src="/GetApp_Mobile1.webp"
                                alt="App Download"
                                width={350}
                                height={350}
                                className="absolute left-[-5%] -top-10 z-2 w-55 sm:w-75 lg:left-[-3%] xl:-top-23 xl:w-87.5 md:top-[-40%] lg:-top-44"
                            />
                            <Image
                                src="/GetApp_Mobile2.webp"
                                alt="App Download"
                                width={350}
                                height={350}
                                className="absolute right-[-5%] -top-12 w-55 sm:w-75 xl:-top-26 xl:w-87.5 md:top-[-40%] lg:-top-48 lg:right-[-4%]"
                            />

                        </div>
                    </div>
                    {/* Right Content */}
                    <div className="relative z-10 order-1 mx-auto max-w-xl text-center xl:mx-0 xl:pl-6 xl:text-left">
                        <h2 className="mx-auto max-w-lg text-[clamp(1rem,8vw,3.5rem)] font-extrabold leading-[0.92] tracking-tighter text-[#050505] xl:mx-0">
                            Download Latest
                            <br />
                            Version Of The
                            <br />
                            App From
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#2A2100] sm:text-lg xl:mx-0">
                            Get the latest Raastah experience on your phone. Book safer campus
                            rides, track trips, and move faster with a cleaner app built for
                            everyday use.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row xl:items-start xl:justify-start">
                            <a
                                href="#"
                                className="inline-flex h-14 items-center gap-3 rounded-[14px] border-2 border-[#EFFF8A] bg-[#050505] px-5 text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black/90"

                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    style={{
                                        width: "1.75rem",
                                        height: "1.75rem",
                                    }}
                                >
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>

                                <span className="flex flex-col items-start leading-none gap-1">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/80">
                                        Get it on
                                    </span>
                                    <span className="text-[18px] font-semibold">
                                        Google Play
                                    </span>
                                </span>
                            </a>

                            <a
                                href="#"
                                className="inline-flex h-14 items-center gap-3 rounded-[14px] border-2 border-[#EFFF8A] bg-black px-5 text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black/90"
                            >
                                <svg

                                    viewBox="0 0 24 24"
                                    fill="white"
                                    style={{
                                        width: "1.75rem",
                                        height: "1.75rem",
                                    }}
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <span className="flex flex-col items-start leading-none gap-1">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/80">
                                        Download on the
                                    </span>
                                    <span className="text-[18px] font-semibold">
                                        App Store
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DownloadSection
