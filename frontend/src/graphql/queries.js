import { gql } from '@apollo/client';

export const GET_ANIME_LIST = gql`
  query GetAnimeList {
    animeList {
      id
      title
      genre
      episodes
    }
  }
`;

// Add more queries or mutations here if needed 