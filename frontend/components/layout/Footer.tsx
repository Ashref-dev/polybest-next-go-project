import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-bold text-xl">MediaHub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your gateway to a world of entertainment with the best movies, series, and anime.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/movies" className="transition-colors hover:text-foreground/80">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="transition-colors hover:text-foreground/80">
                  Series
                </Link>
              </li>
              <li>
                <Link href="/anime" className="transition-colors hover:text-foreground/80">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-foreground/80">
                  Featured
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground/80">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-foreground/80">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground/80">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground/80">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground/80">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MediaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 