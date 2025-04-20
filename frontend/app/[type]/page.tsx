"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import useSWR from "swr";

// Import clients
import { seriesClient } from "@/lib/seriesClient";
import { animeClient } from "@/lib/animeClient";
import { moviesClient } from "@/lib/moviesClient";

// Import types
import { Series, Movie, Anime } from "@/types";

// Import components
import { MediaHero } from "@/components/sections/MediaHero";
import { MediaFilters } from "@/components/sections/MediaFilters";
import { MediaGrid } from "@/components/sections/MediaGrid";

// Define fetcher types
type MoviesFetcher = () => Promise<Movie[]>;
type SeriesFetcher = () => Promise<Series[]>;
type AnimeFetcher = () => Promise<Anime[]>;

// Define each media type's configuration
interface BaseMediaConfig {
  title: string;
  description: string;
  backgroundGradient: string;
  backgroundImage: string;
  textColor: string;
  sortOptions: Array<{ value: string; label: string }>;
}

interface MoviesConfig extends BaseMediaConfig {
  fetchData: MoviesFetcher;
  filterFn: (item: Movie, searchQuery: string, selectedGenre: string) => boolean;
  sortFn: (a: Movie, b: Movie, sortBy: string) => number;
  getGenres: (items: Movie[]) => string[];
  getCoverUrl: (item: Movie) => string;
}

interface SeriesConfig extends BaseMediaConfig {
  fetchData: SeriesFetcher;
  filterFn: (item: Series, searchQuery: string, selectedGenre: string, episodeRange?: number[], maxEpisodes?: number) => boolean;
  sortFn: (a: Series, b: Series, sortBy: string) => number;
  getGenres: (items: Series[]) => string[];
  getCoverUrl: (item: Series) => string;
}

interface AnimeConfig extends BaseMediaConfig {
  fetchData: AnimeFetcher;
  filterFn: (item: Anime, searchQuery: string, selectedGenre: string, episodeRange?: number[], maxEpisodes?: number) => boolean;
  sortFn: (a: Anime, b: Anime, sortBy: string) => number;
  getGenres: (items: Anime[]) => string[];
  getCoverUrl: (item: Anime) => string;
}

// Media type configurations
const mediaTypeConfig = {
  movies: {
    title: "Movie Collection",
    description: "Discover blockbuster hits, hidden gems, and timeless classics from every era and genre in our curated film collection.",
    backgroundGradient: "bg-gradient-to-r from-red-700 to-orange-700",
    backgroundImage: "https://www.browardcenter.org/assets/img/edp_BronxTale_2122_955x500-f30235f38f.jpg",
    textColor: "text-red-100",
    sortOptions: [
      { value: "title", label: "Title (A-Z)" },
      { value: "year", label: "Year (New to Old)" }
    ],
    fetchData: () => moviesClient.listMovies(),
    filterFn: (item: Movie, searchQuery: string, selectedGenre: string) => {
      const matchesSearch = item.Title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "all" || item.Genre === selectedGenre;
      return matchesSearch && matchesGenre;
    },
    sortFn: (a: Movie, b: Movie, sortBy: string) => {
      if (sortBy === "title") {
        return a.Title.localeCompare(b.Title);
      } else if (sortBy === "year") {
        return b.Year - a.Year;
      }
      return 0;
    },
    getGenres: (items: Movie[]) => Array.from(new Set(items.map(item => item.Genre))),
    getCoverUrl: (item: Movie) => item.CoverURL
  } as MoviesConfig,
  
  series: {
    title: "TV Series Collection",
    description: "Explore our extensive collection of TV series spanning multiple genres, from gripping dramas to laugh-out-loud comedies.",
    backgroundGradient: "bg-gradient-to-r from-blue-700 to-teal-600",
    backgroundImage: "https://www.bpmcdn.com/f/files/kelowna/import/2022-06/29555137_web1_220630-KCN-Breaking-Bad-_1.jpg",
    textColor: "text-blue-100",
    sortOptions: [
      { value: "title", label: "Title (A-Z)" },
      { value: "episodes", label: "Episodes (High to Low)" }
    ],
    fetchData: () => seriesClient.getAllSeries(),
    filterFn: (item: Series, searchQuery: string, selectedGenre: string, episodeRange?: number[], maxEpisodes?: number) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "all" || item.genre === selectedGenre;
      const matchesEpisodes = !episodeRange || !maxEpisodes || (
        item.totalEpisodes >= episodeRange[0] && 
        item.totalEpisodes <= (episodeRange[1] === 100 ? maxEpisodes : episodeRange[1])
      );
      return matchesSearch && matchesGenre && matchesEpisodes;
    },
    sortFn: (a: Series, b: Series, sortBy: string) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "episodes") {
        return b.totalEpisodes - a.totalEpisodes;
      }
      return 0;
    },
    getGenres: (items: Series[]) => Array.from(new Set(items.map(item => item.genre))),
    getCoverUrl: (item: Series) => item.coverUrl
  } as SeriesConfig,
  
  anime: {
    title: "Anime Collection",
    description: "Explore our collection of anime series featuring incredible stories, unique art styles, and unforgettable characters.",
    backgroundGradient: "bg-gradient-to-r from-purple-700 to-indigo-800",
    backgroundImage: "https://www.vitalthrills.com/wp-content/uploads/2024/12/invincibleccxp1.jpg",
    textColor: "text-indigo-100",
    sortOptions: [
      { value: "title", label: "Title (A-Z)" },
      { value: "episodes", label: "Episodes (High to Low)" }
    ],
    fetchData: () => animeClient.getAnimeList(),
    filterFn: (item: Anime, searchQuery: string, selectedGenre: string, episodeRange?: number[], maxEpisodes?: number) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === "all" || item.genre === selectedGenre;
      const matchesEpisodes = !episodeRange || !maxEpisodes || (
        item.episodes >= episodeRange[0] && 
        item.episodes <= (episodeRange[1] === 100 ? maxEpisodes : episodeRange[1])
      );
      return matchesSearch && matchesGenre && matchesEpisodes;
    },
    sortFn: (a: Anime, b: Anime, sortBy: string) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "episodes") {
        return b.episodes - a.episodes;
      }
      return 0;
    },
    getGenres: (items: Anime[]) => Array.from(new Set(items.map(item => item.genre))),
    getCoverUrl: (item: Anime) => item.coverUrl
  } as AnimeConfig
};

export default function MediaListPage() {
  const params = useParams();
  const mediaType = params.type as keyof typeof mediaTypeConfig;
  
  // Validate media type
  if (!Object.keys(mediaTypeConfig).includes(mediaType)) {
    notFound();
  }
  
  // Get configuration for this media type
  const config = mediaTypeConfig[mediaType];
  
  // State for filters and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [episodeRange, setEpisodeRange] = useState([0, 100]);
  
  // Create a key for the SWR fetcher
  const fetcherKey = `${mediaType}-list`;
  
  // Define type-safe fetcher functions for SWR
  type FetcherFn = () => Promise<unknown>;

  // Define fetcher functions that are correctly typed for each media type
  const getDataFetcher = (): FetcherFn => {
    if (mediaType === "movies") {
      return mediaTypeConfig.movies.fetchData;
    } else if (mediaType === "series") {
      return mediaTypeConfig.series.fetchData;
    } else {
      return mediaTypeConfig.anime.fetchData;
    }
  };

  // Fetch media data
  const { data, error, isLoading } = useSWR(fetcherKey, getDataFetcher());
  
  // Type-guard helper functions
  const isMovieArray = (items: unknown): items is Movie[] => {
    return items instanceof Array && items.length > 0 && 'Title' in items[0];
  };
  
  const isSeriesArray = (items: unknown): items is Series[] => {
    return items instanceof Array && items.length > 0 && 'totalEpisodes' in items[0];
  };
  
  const isAnimeArray = (items: unknown): items is Anime[] => {
    return items instanceof Array && items.length > 0 && 'episodeList' in items[0];
  };
  
  // Get all genres for filter - with proper type checking
  const getGenres = () => {
    if (!data) return [];
    
    if (mediaType === "movies" && isMovieArray(data)) {
      return mediaTypeConfig.movies.getGenres(data);
    } else if (mediaType === "series" && isSeriesArray(data)) {
      return mediaTypeConfig.series.getGenres(data);
    } else if (mediaType === "anime" && isAnimeArray(data)) {
      return mediaTypeConfig.anime.getGenres(data);
    }
    
    return [];
  };
  
  const genres = getGenres();
  
  // Calculate max episodes for range slider (only for series and anime)
  const hasEpisodeFilter = mediaType === "series" || mediaType === "anime";
  
  const calcMaxEpisodes = (): number => {
    if (!hasEpisodeFilter || !data) return 100;
    
    if (mediaType === "series" && isSeriesArray(data)) {
      return Math.max(...data.map(item => item.totalEpisodes), 100);
    } else if (mediaType === "anime" && isAnimeArray(data)) {
      return Math.max(...data.map(item => item.episodes), 100);
    }
    
    return 100;
  };
  
  const maxEpisodes = calcMaxEpisodes();
  
  // Filter and sort the media items with proper types
  const getFilteredAndSortedItems = () => {
    if (!data) return [];
    
    if (mediaType === "movies" && isMovieArray(data)) {
      return data
        .filter(item => mediaTypeConfig.movies.filterFn(item, searchQuery, selectedGenre))
        .sort((a, b) => mediaTypeConfig.movies.sortFn(a, b, sortBy));
    }
    
    if (mediaType === "series" && isSeriesArray(data)) {
      return data
        .filter(item => mediaTypeConfig.series.filterFn(item, searchQuery, selectedGenre, episodeRange, maxEpisodes))
        .sort((a, b) => mediaTypeConfig.series.sortFn(a, b, sortBy));
    }
    
    if (mediaType === "anime" && isAnimeArray(data)) {
      return data
        .filter(item => mediaTypeConfig.anime.filterFn(item, searchQuery, selectedGenre, episodeRange, maxEpisodes))
        .sort((a, b) => mediaTypeConfig.anime.sortFn(a, b, sortBy));
    }
    
    return [];
  };
  
  const filteredItems = getFilteredAndSortedItems();
  
  // Prepare items for display with cover URLs
  const prepareItemsForDisplay = () => {
    if (mediaType === "movies" && isMovieArray(filteredItems)) {
      return filteredItems.map(item => ({
        ...item,
        coverUrl: item.CoverURL || mediaTypeConfig.movies.getCoverUrl(item)
      }));
    }
    
    if (mediaType === "series" && isSeriesArray(filteredItems)) {
      return filteredItems.map(item => ({
        ...item,
        coverUrl: item.coverUrl || mediaTypeConfig.series.getCoverUrl(item),
        progress: item.totalEpisodes > 0 ? 
          Math.round((item.watchedEpisodes / item.totalEpisodes) * 100) : 0,
        status: item.watchedEpisodes >= item.totalEpisodes ? 
          "Completed" : item.watchedEpisodes > 0 ? "In Progress" : "Not Started"
      }));
    }
    
    if (mediaType === "anime" && isAnimeArray(filteredItems)) {
      return filteredItems.map(item => ({
        ...item,
        coverUrl: item.coverUrl || mediaTypeConfig.anime.getCoverUrl(item),
        episodeCount: item.episodes,
        hasAvailableEpisodes: Array.isArray(item.episodeList) && item.episodeList.length > 0
      }));
    }
    
    return [];
  };
  
  const displayItems = prepareItemsForDisplay();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section with animation */}
      <div className="relative">
        <MediaHero
          title={config.title}
          description={config.description}
          backgroundGradient={config.backgroundGradient}
          backgroundImage={config.backgroundImage}
          textColor={config.textColor}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>
      </div>

      {/* Filters Section with glass effect */}
      <div className="relative z-10 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MediaFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={config.sortOptions}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            genres={genres}
            hasEpisodeFilter={hasEpisodeFilter}
            episodeRange={episodeRange}
            setEpisodeRange={setEpisodeRange}
            maxEpisodes={maxEpisodes}
          />
        </div>
      </div>

      {/* Content Grid with modern spacing */}
      <div className="py-4 max-w-7xl mx-auto">
        <MediaGrid 
          isLoading={isLoading}
          error={error}
          items={displayItems}
          mediaType={mediaType}
          selectedGenre={selectedGenre}
        />
      </div>
    </div>
  );
} 