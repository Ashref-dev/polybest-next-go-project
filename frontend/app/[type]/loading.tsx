import { Skeleton } from "@/components/ui/skeleton";

export default function MediaTypeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-800 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <Skeleton className="h-10 w-3/4 mb-6" />
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </section>

      {/* Filters Section Skeleton */}
      <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-10 w-56" />
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid Skeleton */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <div key={`skeleton-${index}`} className="space-y-3">
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                  <Skeleton className="h-3 w-1/2 rounded-lg" />
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
} 