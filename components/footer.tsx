import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 bg-[#0a0a0a] text-white">
      <div className="container max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <span className="font-bold text-xl tracking-tight">Raastah</span>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            The student ride-sharing platform. Share the ride, split the cost, and save the environment.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#features" className="hover:text-primary">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="#safety" className="hover:text-primary">Safety</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#about" className="hover:text-primary">About</Link></li>
            <li><Link href="#contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="#legal" className="hover:text-primary">Legal</Link></li>
          </ul>
        </div>
      </div>
      <div className="container max-w-6xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t text-sm text-muted-foreground flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Raastah. All rights reserved.</p>
      </div>
    </footer>
  );
}
