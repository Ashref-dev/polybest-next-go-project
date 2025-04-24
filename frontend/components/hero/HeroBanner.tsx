import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Preview as FloatingHero } from "@/components/ui/floating-demo";

export function HeroBanner() {
  return (
    <section className="relative h-[calc(100vh-200px)] overflow-hidden">
      {/* Floating Hero Component */}
      <div className="absolute inset-0">
        <FloatingHero />
      </div>

      {/* Hero Content - Positioned on top of the floating hero */}
      <div className="relative h-[calc(100vh-50px)] flex items-center justify-center pointer-events-none">
        <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 bg-black/20 p-8 md:p-10 rounded-2xl pointer-events-auto">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                <span className="block mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Discover
                </span>
                <span className="block">Your Next Favorite Story</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Explore a world of entertainment with our curated collection of
                movies, series, and anime all in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button
                size="lg"
                className=" px-8 h-12 text-base bg-primary hover:bg-primary/90 border-0 shadow-lg"
                asChild
              >
                <Link href="/series">Watch Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className=" px-8 h-12 text-base bg-black/30 backdrop-blur-sm border-white/20 hover:bg-black/40 hover:border-primary/50 text-white shadow-lg"
                asChild
              >
                <Link href="#featured-content">Explore Featured</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
