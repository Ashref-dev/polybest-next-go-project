import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MediaSectionProps {
  title: string;
  children: ReactNode;
  viewAllHref?: string;
}

export function MediaSection({ title, children, viewAllHref }: MediaSectionProps) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {viewAllHref && (
            <Button variant="outline" size="sm" asChild>
              <Link href={viewAllHref}>View All</Link>
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
} 