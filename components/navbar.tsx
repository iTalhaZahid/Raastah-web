import Link from "next/link";
import { Play } from "lucide-react";

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full pt-6">
      <div className="container flex h-16 max-w-[1200px] mx-auto items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-12 h-12 bg-[#d4ff00] rounded-[14px] flex items-center justify-center shadow-lg">
            {/* Custom logo icon based on the inspiration */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </div>
        </Link>

        {/* Center Nav Pills */}
        <nav className="hidden md:flex bg-[#1a1a1a]/80 backdrop-blur-md rounded-full p-1.5 border border-white/5">
          <Link href="#home" className="px-5 py-2 text-sm font-medium text-white bg-[#2a2a2a] rounded-full transition-colors">
            Home
          </Link>
          <Link href="#how-it-works" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full transition-colors">
            How it Works
          </Link>
          <Link href="#features" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full transition-colors">
            Features
          </Link>
          <Link href="#testimonial" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full transition-colors">
            Testimonial
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center">
          <Link 
            href="#download" 
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#d4ff00] px-6 text-sm font-semibold text-black transition-colors hover:bg-[#c4ec00] shadow-[0_0_15px_rgba(212,255,0,0.3)]"
          >
            <Play className="w-4 h-4 fill-black" />
            Google Play
          </Link>
        </div>

      </div>
    </header>
  );
}
