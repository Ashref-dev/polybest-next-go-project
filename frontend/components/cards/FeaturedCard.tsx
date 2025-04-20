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
  const mediaTypeUrl = type === "movie" ? "movies" : type === "series" ? "series" : "anime";
  
  // Build the detail page URL with the new route structure
  const detailUrl = `/${mediaTypeUrl}/${id}`;
  
  // Generate gradient based on media type for fallback
  const gradientBg = 
    type === "movie" 
      ? "from-red-700/80 to-orange-700/80"
      : type === "series"
      ? "from-blue-700/80 to-teal-600/80"
      : "from-purple-700/80 to-indigo-800/80";
  
  // Generate badge color based on type
  const badgeColor = 
    type === "movie" 
      ? "bg-red-500/90 hover:bg-red-500/100"
      : type === "series"
      ? "bg-blue-500/90 hover:bg-blue-500/100"
      : "bg-purple-500/90 hover:bg-purple-500/100";
  
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-background/5 backdrop-blur-sm h-full transition-all duration-300 hover:shadow-xl">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientBg}`}></div>
        
        {/* Background image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover mix-blend-overlay opacity-60"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Badge */}
        <Badge className={`absolute top-4 right-4 ${badgeColor} text-white backdrop-blur-sm text-xs font-semibold px-3 py-1.5`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h3 className="font-bold text-2xl text-white mb-2">{title}</h3>
          <p className="text-gray-200 text-sm">{genre}</p>
          
          {description && (
            <p className="text-gray-300 mt-4 line-clamp-2 text-sm md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <CardFooter className="p-4 flex justify-between items-center bg-gradient-to-r from-background to-background/80">
        {additionalInfo && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{additionalInfo.label}:</span>
            <Badge variant="secondary" className="font-medium">
              {additionalInfo.value}
            </Badge>
          </div>
        )}
        
        <Button 
          asChild 
          className="gap-1"
          variant="ghost"
        >
          <Link href={detailUrl}>
            Watch Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 