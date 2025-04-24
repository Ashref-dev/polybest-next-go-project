import Image from "next/image";
import Link from "next/link";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeaturedCardProps {
  id: number;
  title: string;
  description?: string;
  genre: string;
  type: "movie" | "series" | "anime";
  imageSrc?: string;
  additionalInfo?: {
    label: string;
    value: string | number;
  };
}

export function FeaturedCard({
  id,
  title,
  description,
  genre,
  type,
  imageSrc = "/placeholder-media.jpg",
  additionalInfo,
}: FeaturedCardProps) {
  // Determine the media type for the URL (convert to plural form)
  const mediaTypeUrl =
    type === "movie" ? "movies" : type === "series" ? "series" : "anime";

  // Build the detail page URL with the new route structure
  const detailUrl = `/${mediaTypeUrl}/${id}`;

  // Generate badge color based on type
  const badgeColor =
    type === "movie"
      ? "bg-red-500/90 hover:bg-red-500/100"
      : type === "series"
      ? "bg-blue-500/90 hover:bg-blue-500/100"
      : "bg-purple-500/90 hover:bg-purple-500/100";

  return (
    <Card className="group overflow-hidden border-0 shadow-lg bg-background/5 backdrop-blur-sm h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative w-full aspect-[16/12] overflow-hidden">
        {/* Background image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>

        {/* Badge */}
        <Badge
          className={`absolute top-4 right-4 ${badgeColor} text-white backdrop-blur-sm text-xs font-semibold px-3 py-1.5 transition-transform duration-300 group-hover:scale-110`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 w-full transition-all duration-300 group-hover:translate-y-1">
          <h3 className="font-bold text-2xl text-white mb-2 transition-all duration-300 group-hover:text-xl group-hover:mb-3">
            {title}
          </h3>
          <p className="text-gray-200 text-sm transition-all duration-300 group-hover:translate-x-1">
            {genre}
          </p>

          {description && (
            <p className="text-gray-300 mt-4 line-clamp-2 text-sm md:text-base transition-all duration-300 group-hover:translate-x-1">
              {description}
            </p>
          )}
        </div>
      </div>

      <CardFooter className="p-4 flex justify-between items-center bg-gradient-to-r from-background to-background/80 transition-all duration-300 group-hover:from-background/90 group-hover:to-background/70">
        {additionalInfo && (
          <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
            <span className="text-sm font-medium">{additionalInfo.label}:</span>
            <Badge
              variant="secondary"
              className="font-medium transition-transform duration-300 group-hover:scale-105"
            >
              {additionalInfo.value}
            </Badge>
          </div>
        )}

        <Button
          asChild
          className="gap-1 transition-all duration-300 hover:gap-2"
          variant="ghost"
        >
          <Link href={detailUrl}>
            Watch Now
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
