import React, { useState, useEffect } from 'react';
import { getSeries } from '../services/seriesService'; // We will create this service

function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const data = await getSeries();
        setSeries(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching series:", err);
        setError('Failed to load series. Check console for details.');
        setSeries([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TV Series (REST API)</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.length > 0 ? (
            series.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{s.title}</h2>
                <p className="text-gray-600">Genre: {s.genre}</p>
                <p className="text-gray-600">Episodes: {s.watchedEpisodes} / {s.totalEpisodes}</p>
              </div>
            ))
          ) : (
            <p>No series data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SeriesPage; 