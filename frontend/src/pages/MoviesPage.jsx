import React, { useState, useEffect } from 'react';
import { listMovies } from '../services/moviesService'; // We will create this service
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Movies</h1>
        <div className="text-sm text-muted-foreground">SOAP API</div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 bg-destructive/10 rounded-lg text-center">
          <p className="text-destructive">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.length > 0 ? (
            movies.map((m) => (
              <Card key={m.ID}>
                <CardHeader>
                  <CardTitle>{m.Title}</CardTitle>
                  <CardDescription>{m.Genre}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center text-sm px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    <span className="font-medium">{m.Year}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
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