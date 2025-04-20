import { MediaCard } from "@/components/cards/MediaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Series, Movie, Anime } from "@/types";
import { motion } from "framer-motion";

interface ExtendedSeries extends Series {
  progress?: number;
  status?: string;
}

interface ExtendedAnime extends Anime {
  episodeCount?: number;
  hasAvailableEpisodes?: boolean;
}

type ExtendedMediaItem = Movie | ExtendedSeries | ExtendedAnime;

interface MediaGridProps {
  isLoading: boolean;
  error: any;
  items: ExtendedMediaItem[];
  mediaType: "series" | "movies" | "anime";
  selectedGenre?: string;
}

export function MediaGrid({
  isLoading,
  error,
  items,
  mediaType,
  selectedGenre,
}: MediaGridProps) {
  // Get singular form of media type
  const mediaTypeSingular =
    mediaType === "series"
      ? "series"
      : mediaType === "movies"
      ? "movie"
      : "anime";

  // Animation variants for staggered grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-8">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={`skeleton-${index}`} className="space-y-3">
                  <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-muted/50 rounded-xl backdrop-blur-sm border border-muted shadow-lg">
            <h3 className="text-xl text-red-500 mb-3 font-medium">
              Failed to load {mediaType}
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              There was an error loading the {mediaType} collection. Please try
              again later.
            </p>
          </div>
        ) : items.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((item: ExtendedMediaItem) => {
                // Handle different properties based on media type
                const id =
                  mediaType === "movies"
                    ? (item as Movie).ID
                    : (item as ExtendedSeries | ExtendedAnime).id;

                const title =
                  mediaType === "movies"
                    ? (item as Movie).Title
                    : (item as ExtendedSeries | ExtendedAnime).title;

                const genre =
                  mediaType === "movies"
                    ? (item as Movie).Genre
                    : (item as ExtendedSeries | ExtendedAnime).genre;

                // Enhanced additionalInfo
                let additionalInfo;

                if (mediaType === "movies") {
                  additionalInfo = {
                    label: "Released",
                    value: (item as Movie).Year,
                  };
                } else if (mediaType === "series") {
                  const series = item as ExtendedSeries;
                  const progress =
                    series.progress ??
                    (series.totalEpisodes > 0
                      ? Math.round(
                          (series.watchedEpisodes / series.totalEpisodes) * 100
                        )
                      : 0);

                  additionalInfo = {
                    label: `${series.watchedEpisodes}/${series.totalEpisodes} Episodes`,
                    value: `${progress}%`,
                  };
                } else {
                  // anime
                  const anime = item as ExtendedAnime;
                  const episodeCount = anime.episodeCount ?? anime.episodes;

                  additionalInfo = {
                    label: "Episodes",
                    value: episodeCount,
                  };
                }

                // Get the image URL based on the media type
                let imageSrc = "/placeholder-media.jpg";
                if (mediaType === "movies") {
                  const movie = item as Movie;
                  imageSrc =
                    movie.CoverURL ||
                    movie.CoverURL ||
                    "/placeholder-media.jpg";
                } else if (mediaType === "series") {
                  const series = item as ExtendedSeries;
                  imageSrc =
                    series.coverUrl ||
                    series.coverUrl ||
                    "/placeholder-media.jpg";
                } else {
                  const anime = item as ExtendedAnime;
                  imageSrc =
                    anime.coverUrl ||
                    anime.coverUrl ||
                    "/placeholder-media.jpg";
                }

                return (
                  <motion.div key={id} variants={itemVariants}>
                    <MediaCard
                      id={id}
                      title={title}
                      genre={genre}
                      type={mediaTypeSingular as "movie" | "series" | "anime"}
                      imageSrc={imageSrc}
                      additionalInfo={additionalInfo}
                      description={
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. lorem ipsum again but this time it's a bit longer and more random text to see how it looks for aesthetic purposes."
                      }
                    />
                  </motion.div>
                );
              })}
            </motion.div>
            <div className="text-center mt-12 text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm py-3 px-6 rounded-full inline-block mx-auto shadow-sm">
              Showing {items.length}{" "}
              {items.length === 1 ? mediaTypeSingular : mediaType}
              {selectedGenre &&
                selectedGenre !== "all" &&
                ` in ${selectedGenre}`}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-xl backdrop-blur-sm border border-muted shadow-lg">
            <h3 className="text-xl mb-3 font-medium">No {mediaType} found</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              No {mediaType} match your search criteria. Try adjusting your
              filters or try a different search term.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
