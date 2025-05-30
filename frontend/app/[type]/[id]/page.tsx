import { notFound } from "next/navigation";
import { Metadata } from "next";

// Import clients
import { seriesClient } from "@/lib/seriesClient";
import { animeClient } from "@/lib/animeClient";
import { moviesClient } from "@/lib/moviesClient";

// Import types
import { Series, Movie, Anime } from "@/types";

// Import client components
import { MediaDetailClient } from "@/components/media/MediaDetailClient";
import { MediaDetailSkeleton } from "@/components/media/MediaDetailSkeleton";
import { Suspense } from "react";

// Define interface for metadata generation
interface MetadataProps {
  params: Promise<{ id: string; type: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { type, id } = await params;

  try {
    let title = "";
    let description = "";
    let imageUrl = "";

    // Fetch data based on media type
    if (type === "movies") {
      const movie = await moviesClient.getMovieDetails(parseInt(id));
      title = movie.Title;
      description = `${movie.Genre} (${movie.Year})`;
      imageUrl = movie.CoverURL;
    } else if (type === "series") {
      const series = await seriesClient.getSeriesById(parseInt(id));
      title = series.title;
      description = `${series.genre} • ${series.totalEpisodes} Episodes`;
      imageUrl = series.coverUrl;
    } else if (type === "anime") {
      const anime = await animeClient.getAnimeById(parseInt(id));
      title = anime.title;
      description = `${anime.genre} • ${anime.episodes} Episodes`;
      imageUrl = anime.coverUrl;
    }

    return {
      title: title || "Media Details",
      description: description,
      openGraph: {
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Media Details",
    };
  }
}

// Server component that fetches data and renders the client component
export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{
    type: string;
    id: string;
  }>;
}) {
  const { type, id } = await params;

  // Validate media type
  if (!["movies", "series", "anime"].includes(type)) {
    notFound();
  }

  // Determine if this is a series with episodes for skeleton loading state
  const hasEpisodes = type === "series" || type === "anime";

  return (
    <Suspense fallback={<MediaDetailSkeleton hasEpisodes={hasEpisodes} />}>
      <MediaDetailContent type={type} id={id} />
    </Suspense>
  );
}

// Separate async component to handle data fetching
async function MediaDetailContent({ type, id }: { type: string; id: string }) {
  let mediaData: Movie | Series | Anime | null = null;

  console.log("Starting to fetch media:", { type, id });

  try {
    // Fetch data based on media type
    if (type === "movies") {
      mediaData = await moviesClient.getMovieDetails(parseInt(id));
    } else if (type === "series") {
      mediaData = await seriesClient.getSeriesById(parseInt(id));
      console.log("Fetched series from API:", mediaData);
      if (mediaData && !Array.isArray(mediaData.episodes)) {
        mediaData.episodes = [];
      }
    } else if (type === "anime") {
      console.log("Attempting to fetch anime with ID:", id);
      mediaData = await animeClient.getAnimeById(parseInt(id));
      console.log("Fetched anime from API:", mediaData);
      if (mediaData && !Array.isArray(mediaData.episodeList)) {
        mediaData.episodeList = [];
      }
    }

    // Handle case when data is not found
    if (!mediaData) {
      console.log("No data found for:", { type, id });
      notFound();
    }
  } catch (err) {
    console.error(`Error fetching ${type} with id ${id}:`, err);
    notFound();
  }
  
  console.log("Successfully fetched mediaData:", mediaData);

  return (
    <MediaDetailClient
      mediaData={mediaData}
      mediaType={type as "movies" | "series" | "anime"}
    />
  );
}
