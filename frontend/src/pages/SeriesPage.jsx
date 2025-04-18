import React, { useState, useEffect } from 'react';
import { getSeries } from '../services/seriesService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">TV Series</h1>
        <div className="text-sm text-muted-foreground">REST API</div>
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
          {series.length > 0 ? (
            series.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.genre}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span>Progress:</span>
                      <span className="font-medium">{s.watchedEpisodes} / {s.totalEpisodes}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(s.watchedEpisodes / s.totalEpisodes) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
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