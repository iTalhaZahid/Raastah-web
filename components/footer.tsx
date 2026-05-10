import { Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="font-sans bg-[#050505] px-4 pb-10 pt-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Raastah</h3>
                <p className="text-xs text-zinc-500">Every Road. Your Way.</p>
              </div>
            </div>

            <p className="mt-8 text-sm text-zinc-500">
              © {new Date().getFullYear()} Raastah. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#home" className="transition hover:text-[#d4ff00]">Home</a></li>
              <li><a href="#how-it-works" className="transition hover:text-[#d4ff00]">How It Works</a></li>
              <li><a href="#features" className="transition hover:text-[#d4ff00]">Features</a></li>
              <li><a href="#safety" className="transition hover:text-[#d4ff00]">Safety</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Support</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#" className="transition hover:text-[#d4ff00]">Help Center</a></li>
              <li><a href="#" className="transition hover:text-[#d4ff00]">Contact Us</a></li>
              <li><a href="#" className="transition hover:text-[#d4ff00]">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-[#d4ff00]">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Follow Us</h4>
            <div className="flex gap-3">
              {[Star, Star].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-zinc-400 transition hover:bg-[#d4ff00] hover:text-black"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}