import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    Clapperboard,
    Search,
    Menu,
    Home,
    Film,
    Tv,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <Clapperboard className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">PolyBest</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                href="/" 
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                href="/movies" 
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5"
              >
                <Film className="h-4 w-4" />
                <span>Movies</span>
              </Link>
              <Link 
                href="/series" 
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5"
              >
                <Tv className="h-4 w-4" />
                <span>Series</span>
              </Link>
              <Link 
                href="/anime" 
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Anime</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <form className="hidden md:flex relative items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="search" 
                placeholder="Search..."
                className="h-9 w-[180px] lg:w-[240px] rounded-full bg-background border border-input pl-8 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-primary"
              />
            </form>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 