import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ANIME_LIST } from '../graphql/queries'; // We will create this query
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function AnimePage() {
  const { loading, error, data } = useQuery(GET_ANIME_LIST);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Anime</h1>
        <div className="text-sm text-muted-foreground">GraphQL API</div>
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
          <p className="text-destructive">
            Error loading anime: {error.message}. Check console for details.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.animeList.length > 0 ? (
            data.animeList.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle>{a.title}</CardTitle>
                  <CardDescription>{a.genre}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Episodes:</span>
                    <span className="text-sm font-medium">{a.episodes}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
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