import { HeroBanner } from "@/components/hero/HeroBanner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeaturedContent } from "@/components/sections/FeaturedContent";
import { Film, Tv, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      <HeroBanner />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center animate-fade-in [animation-delay:0ms] hover:translate-y-[-4px] transition-transform duration-300">
              <div className="rounded-full bg-primary/10 p-6 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                <Film className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Movies</h3>
              <p className="text-muted-foreground">
                Discover blockbuster hits and classic films from various genres.
              </p>
              <Button
                size="sm"
                className="mt-2 gap-1 group"
                variant="outline"
                asChild
              >
                <Link href="/movies">
                  Browse Movies
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4 text-center animate-fade-in [animation-delay:100ms] hover:translate-y-[-4px] transition-transform duration-300">
              <div className="rounded-full bg-primary/10 p-6 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                <Tv className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Series</h3>
              <p className="text-muted-foreground">
                Follow addictive storylines and compelling characters in
                top-rated TV series.
              </p>
              <Button
                size="sm"
                className="mt-2 gap-1 group"
                variant="outline"
                asChild
              >
                <Link href="/series">
                  Browse Series
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4 text-center animate-fade-in [animation-delay:200ms] hover:translate-y-[-4px] transition-transform duration-300">
              <div className="rounded-full bg-primary/10 p-6 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Anime</h3>
              <p className="text-muted-foreground">
                Explore vibrant animated stories from Japan with unique art
                styles and themes.
              </p>
              <Button
                size="sm"
                className="mt-2 gap-1 group"
                variant="outline"
                asChild
              >
                <Link href="/anime">
                  Browse Anime
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <FeaturedContent
        title="Featured Content"
        subtitle="Handpicked movies, series, and anime that you might enjoy based on popularity and quality."
      />

      <div className="my-16 flex flex-col items-center animate-fade-in [animation-delay:300ms]">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Start Your Entertainment Journey
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mb-8">
          Discover our vast collection of entertainment media all in one place,
          featuring the latest releases and timeless classics.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/movies">
              <Film className="h-5 w-5" />
              Movies
            </Link>
          </Button>
          <Button size="lg" className="gap-2" variant="secondary" asChild>
            <Link href="/series">
              <Tv className="h-5 w-5" />
              Series
            </Link>
          </Button>
          <Button size="lg" className="gap-2" variant="outline" asChild>
            <Link href="/anime">
              <Sparkles className="h-5 w-5" />
              Anime
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
