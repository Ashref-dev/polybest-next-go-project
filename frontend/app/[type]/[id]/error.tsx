"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function MediaDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Media detail page error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">
          We encountered an error while trying to display this media. Please try again or return to the home page.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw size={16} />
            Try again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <HomeIcon size={16} />
              Return home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 