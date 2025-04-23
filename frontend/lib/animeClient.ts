import { Anime, AnimeListResponse, AnimeResponse, AddAnimeInput, AddAnimeResponse } from "../types";

// GraphQL error type definition
type GraphQLError = { message: string; [key: string]: unknown };
const isServer = typeof window === "undefined";


const GRAPHQL_ENDPOINT = isServer
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://gateway"}/api/anime/graphql`
  : "/api/anime/graphql";

/**
 * GraphQL client for the Anime API
 */
export const animeClient = {
  /**
   * Fetches all anime from the API
   */
  async getAnimeList(): Promise<Anime[]> {
    const query = `
              query {
                animeList {
                  id
                  title
                  genre
                  episodes
                  coverUrl
                  episodeList {
                    id
                    title
                    watchUrl
                  }
                }
              }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors.map((e: GraphQLError) => e.message).join(", "));
    }
    
    return (data.data as AnimeListResponse).animeList;
  },

  /**
   * Fetches a single anime by ID
   */
  async getAnimeById(id: number): Promise<Anime> {
    console.log("AnimeClient: Starting request for ID:", id);
    
    const query = `
      query {
        anime(id: ${id}) {
          id
          title
          genre
          episodes
          coverUrl
          episodeList {
            id
            title
            watchUrl
          }
        }
      }
    `;

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      console.log("AnimeClient: Response status:", response.status);

      if (!response.ok) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("AnimeClient: Received data:", data);
      
      if (data.errors) {
        console.error("AnimeClient: GraphQL errors:", data.errors);
        throw new Error(data.errors.map((e: GraphQLError) => e.message).join(", "));
      }
      
      return (data.data as AnimeResponse).anime;
    } catch (error) {
      console.error("AnimeClient: Error in getAnimeById:", error);
      throw error;
    }
  },

  /**
   * Adds a new anime
   */
  async addAnime(input: AddAnimeInput): Promise<Anime> {
    const { title, genre, episodes, coverUrl } = input;
    const mutation = `
      mutation ($title: String!, $genre: String!, $episodes: Int!, $coverUrl: String) {
        addAnime(title: $title, genre: $genre, episodes: $episodes, coverUrl: $coverUrl) {
          id
          title
          genre
          episodes
          coverUrl
          episodeList {
            id
            title
            watchUrl
          }
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: { title, genre, episodes, coverUrl }
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors.map((e: GraphQLError) => e.message).join(", "));
    }
    
    return (data.data as AddAnimeResponse).addAnime;
  }
}; 