"use client";

import { useEffect, useState } from "react";
import { FeaturedCard } from "@/components/cards/FeaturedCard";
import { seriesClient } from "@/lib/seriesClient";
import { animeClient } from "@/lib/animeClient";
import { moviesClient } from "@/lib/moviesClient";
import { Series, Movie, Anime } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedContentProps {
  title: string;
  subtitle?: string;
}

export function FeaturedContent({ title, subtitle }: FeaturedContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState<Array<{
    id: number;
    title: string;
    description?: string;
    genre: string;
    type: "movie" | "series" | "anime";
    imageSrc: string;
    additionalInfo: {
      label: string;
      value: string | number;
    };
  }>>([]);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from all APIs
        const [movies, series, animes] = await Promise.all([
          moviesClient.listMovies(),
          seriesClient.getAllSeries(),
          animeClient.getAnimeList()
        ]);
        
        // Get two featured items from each category
        const featuredMovies = movies.slice(0, 2).map((movie: Movie) => ({
          id: movie.ID,
          title: movie.Title,
          description: `${movie.Year} • ${movie.Genre}`,
          genre: movie.Genre,
          type: "movie" as const,
          imageSrc: movie.CoverURL,
          additionalInfo: {
            label: "Year",
            value: movie.Year
          }
        }));
        
        const featuredSeries = series.slice(0, 2).map((show: Series) => ({
          id: show.id,
          title: show.title,
          description: `${show.watchedEpisodes}/${show.totalEpisodes} episodes watched`,
          genre: show.genre,
          type: "series" as const,
          imageSrc: show.coverUrl,
          additionalInfo: {
            label: "Episodes",
            value: show.totalEpisodes
          }
        }));
        
        const featuredAnime = animes.slice(0, 2).map((anime: Anime) => ({
          id: anime.id,
          title: anime.title,
          description: anime.genre,
          genre: anime.genre,
          type: "anime" as const,
          imageSrc: anime.coverUrl,
          additionalInfo: {
            label: "Episodes",
            value: anime.episodes
          }
        }));
        
        // Combine items in a specific order: 2 movies, 2 series, 2 anime
        const orderedItems = [
          ...featuredMovies,
          ...featuredSeries,
          ...featuredAnime
        ];
        
        setFeaturedItems(orderedItems);
      } catch (error) {
        console.error("Error fetching featured content:", error);
        setFeaturedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-background/70 to-background " id="featured-content">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredItems.map((item) => (
              <FeaturedCard
                key={`${item.type}-${item.id}`}
                id={item.id}
                title={item.title}
                description={item.description}
                genre={item.genre}
                type={item.type}
                imageSrc={item.imageSrc}
                additionalInfo={item.additionalInfo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-lg">
            <h3 className="text-xl mb-3 font-medium">No featured content found</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Please try again later or check out our full collection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 