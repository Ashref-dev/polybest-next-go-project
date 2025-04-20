import Image from "next/image";
import Link from "next/link";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, TvIcon, EyeIcon } from "lucide-react";

interface MediaCardProps {
  id: number;
  title: string;
  genre: string;
  type: "movie" | "series" | "anime";
  imageSrc?: string;
  additionalInfo?: {
    label: string;
    value: string | number;
  };
}

export function MediaCard({
  id,
  title,
  genre,
  type,
  imageSrc = "/placeholder-media.jpg", // Default placeholder image
  additionalInfo,
}: MediaCardProps) {
  // Determine the media type for the URL (convert to plural form)
  const mediaTypeForUrl = type === "movie" ? "movies" : type === "series" ? "series" : "anime";
  
  // Build the detail page URL with the new route structure
  const detailUrl = `/${mediaTypeForUrl}/${id}`;
  
  // Generate gradient based on media type for fallback
  const gradientBg = 
    type === "movie" 
      ? "bg-gradient-to-br from-red-500 to-orange-500"
      : type === "series"
      ? "bg-gradient-to-br from-blue-500 to-green-500"
      : "bg-gradient-to-br from-purple-500 to-indigo-500";

  // Generate icon based on media type
  const MediaIcon = type === "movie" 
    ? StarIcon 
    : type === "series" 
    ? TvIcon 
    : EyeIcon;
  
  return (
    <Link href={detailUrl} className="block transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
      <Card className="overflow-hidden h-full border border-muted shadow-md bg-background hover:shadow-2xl hover:border-primary/20 transition-all duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <div className={`absolute inset-0 ${gradientBg}`}></div>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
            
            <Badge className="absolute top-3 right-3 bg-black/70 hover:bg-black/80 backdrop-blur-sm text-xs font-semibold px-2 py-1 gap-1 transition-colors">
              <MediaIcon size={12} />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-primary-foreground transition-colors">{title}</h3>
              <p className="text-gray-200 text-sm mt-1">{genre}</p>
            </div>
          </div>
        </CardHeader>
        {additionalInfo && (
          <CardFooter className="px-4 py-3 border-t bg-muted/20">
            <div className="text-sm w-full flex justify-between items-center">
              <span className="font-medium">{additionalInfo.label}</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium group-hover:bg-primary/20 transition-colors">
                {additionalInfo.value}
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
} 