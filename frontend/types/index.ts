// Series API Types (REST)
export interface Episode {
  id: number;
  title: string;
  watchUrl: string;
}

export interface Series {
  id: number;
  title: string;
  genre: string;
  totalEpisodes: number;
  watchedEpisodes: number;
  coverUrl: string;
  episodes: Episode[];
}

// Series API Request/Response Types
export interface CreateSeriesRequest {
  title: string;
  genre?: string;
  totalEpisodes?: number;
  watchedEpisodes?: number;
  coverUrl?: string;
  episodes?: Episode[];
}

// Anime API Types (GraphQL)
export interface AnimeEpisode {
  id: number;
  title: string;
  watchUrl: string;
}

export interface Anime {
  id: number;
  title: string;
  genre: string;
  episodes: number;
  coverUrl: string;
  episodeList: AnimeEpisode[];
}

// Anime API GraphQL Query Types
export interface AnimeListResponse {
  animeList: Anime[];
}

export interface AnimeResponse {
  anime: Anime;
}

export interface AddAnimeInput {
  title: string;
  genre: string;
  episodes: number;
  coverUrl?: string;
}

export interface AddAnimeResponse {
  addAnime: Anime;
}

// Movies API Types (SOAP)
export interface Movie {
  ID: number;
  Title: string;
  Genre: string;
  Year: number;
  CoverURL: string;
  WatchURL: string;
}

// Movies API Request/Response Types
export interface ListMoviesResponse {
  Movies: {
    Movie: Movie[];
  };
}

export interface GetMovieDetailsRequest {
  ID: number;
}

export interface GetMovieDetailsResponse {
  Movie: Movie;
}

// SOAP Error Response Type
export interface SoapFault {
  faultcode: string;
  faultstring: string;
}
