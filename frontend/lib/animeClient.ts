import { Anime, AnimeListResponse, AnimeResponse, AddAnimeInput, AddAnimeResponse } from "../types";

// GraphQL error type definition
type GraphQLError = { message: string; [key: string]: unknown };

const GRAPHQL_ENDPOINT = "/api/anime/graphql";

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
    const query = `
      query ($id: Int!) {
        anime(id: $id) {
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
        query,
        variables: { id }
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors.map((e: GraphQLError) => e.message).join(", "));
    }
    
    return (data.data as AnimeResponse).anime;
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