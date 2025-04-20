import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">MediaHub</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex items-center gap-6 text-sm">
              <Link href="/" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link href="/movies" className="transition-colors hover:text-foreground/80">
                Movies
              </Link>
              <Link href="/series" className="transition-colors hover:text-foreground/80">
                Series
              </Link>
              <Link href="/anime" className="transition-colors hover:text-foreground/80">
                Anime
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
} 