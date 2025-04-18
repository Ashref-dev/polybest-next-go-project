import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// The URI will point to the gateway path for the anime API
// We assume the gateway runs on localhost and forwards /api/anime/*
const GRAPHQL_ENDPOINT = '/api/anime/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client; 