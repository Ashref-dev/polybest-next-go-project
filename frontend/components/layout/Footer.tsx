import Link from "next/link";
import { Clapperboard, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section with logo and nav columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <Clapperboard className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">PolyBest</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your gateway to a world of entertainment with the best movies, series, and anime.
            </p>
            {/* Social links */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="col-span-1 md:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Explore</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/movies" className="text-muted-foreground transition-colors hover:text-primary">
                      Movies
                    </Link>
                  </li>
                  <li>
                    <Link href="/series" className="text-muted-foreground transition-colors hover:text-primary">
                      Series
                    </Link>
                  </li>
                  <li>
                    <Link href="/anime" className="text-muted-foreground transition-colors hover:text-primary">
                      Anime
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright bar */}
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PolyBest. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">Made with ❤️ for entertainment lovers</p>
        </div>
      </div>
    </footer>
  );
} 