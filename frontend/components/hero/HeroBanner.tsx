import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-zinc-900">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50" />
      </div>
      
      {/* Hero Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 md:py-32 lg:py-40">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
            Discover Your Next Favorite Story
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Explore a world of entertainment with our collection of movies, series, and anime all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/series">Watch Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-black/50 hover:bg-black/70 text-white">
              <Link href="#featured-content">Featured</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 