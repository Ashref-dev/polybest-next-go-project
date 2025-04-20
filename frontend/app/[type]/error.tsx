"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function MediaTypeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to the console
  useEffect(() => {
    console.error(error);
  }, [error]);

  const params = useParams();
  const mediaType = params.type as string;
  let mediaLabel = "content";

  if (mediaType === "movies") {
    mediaLabel = "movies";
  } else if (mediaType === "series") {
    mediaLabel = "series";
  } else if (mediaType === "anime") {
    mediaLabel = "anime";
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We encountered an error trying to load the {mediaLabel} collection. Please try again.
        </p>
        <Button
          onClick={() => reset()}
          variant="default"
        >
          Try again
        </Button>
      </div>
    </div>
  );
} 