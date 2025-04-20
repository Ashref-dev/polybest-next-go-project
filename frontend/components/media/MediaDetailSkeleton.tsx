import { Skeleton } from "@/components/ui/skeleton";

interface MediaDetailSkeletonProps {
  hasEpisodes: boolean;
}

export function MediaDetailSkeleton({ hasEpisodes }: MediaDetailSkeletonProps) {
  return (
    <>
      {/* Video Skeleton */}
      <section>
        <Skeleton className="w-full aspect-video max-h-[calc(100vh-200px)]" />
      </section>

      {/* Details Skeleton */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Skeleton */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-9 w-24" />
                  {hasEpisodes && <Skeleton className="h-9 w-24" />}
                  <Skeleton className="h-9 w-24" />
                </div>
                
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            </div>
            
            {/* Side Content Skeleton */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 