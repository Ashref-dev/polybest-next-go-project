import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ANIME_LIST } from '../graphql/queries'; // We will create this query

function AnimePage() {
  const { loading, error, data } = useQuery(GET_ANIME_LIST);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anime (GraphQL API)</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && (
        <p className="text-center text-red-500">
          Error loading anime: {error.message}. Check console for details.
        </p>
      )}
      {!loading && !error && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.animeList.length > 0 ? (
            data.animeList.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{a.title}</h2>
                <p className="text-gray-600">Genre: {a.genre}</p>
                <p className="text-gray-600">Episodes: {a.episodes}</p>
              </div>
            ))
          ) : (
            <p>No anime data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AnimePage; 