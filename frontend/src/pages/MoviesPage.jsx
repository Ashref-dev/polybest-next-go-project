import React, { useState, useEffect } from 'react';
import { listMovies } from '../services/moviesService'; // We will create this service

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await listMovies(); // This function needs to handle the SOAP request/response
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError('Failed to load movies. Check console for details.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movies (SOAP API)</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.length > 0 ? (
            movies.map((m) => (
              <div key={m.ID} className="bg-white p-4 rounded shadow"> {/* Note: ID from XML */} 
                <h2 className="text-xl font-semibold">{m.Title}</h2> {/* Note: Title from XML */}
                <p className="text-gray-600">Genre: {m.Genre}</p>   {/* Note: Genre from XML */}
                <p className="text-gray-600">Year: {m.Year}</p>     {/* Note: Year from XML */}
              </div>
            ))
          ) : (
            <p>No movie data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MoviesPage; 