import Image from "next/image";
import Link from "next/link";
import { StarIcon, TvIcon, EyeIcon, InfoIcon } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

export interface ModernMediaCardProps {
  id: number;
  title: string;
  genre?: string;
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
  imageSrc = "/placeholder-media.jpg",
  additionalInfo,
}: ModernMediaCardProps) {
  const mediaType = type === "movie" ? "movies" : type === "series" ? "series" : "anime";
  const detailUrl = `/${mediaType}/${id}`;
  const IconComponent = type === "movie" ? StarIcon : type === "series" ? TvIcon : EyeIcon;

  return (
    <Drawer side="right">
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md transition-shadow duration-300 hover:shadow-xl">
        <Link href={detailUrl} className="block w-full">
          <div className="relative w-full aspect-[16/12]">
            <Image
              src={imageSrc!}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
              {genre && <p className="mt-1 text-sm opacity-80">{genre}</p>}
            </div>
            <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full">
              <IconComponent size={16} className="text-white" />
            </div>
          </div>
        </Link>
        {additionalInfo && (
          <DrawerTrigger asChild>
            <button className="absolute top-4 left-4 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow hover:bg-white/90 transition-colors">
              <InfoIcon className="w-5 h-5 text-gray-800 dark:text-white" />
            </button>
          </DrawerTrigger>
        )}
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {genre && <DrawerDescription>Genre: {genre}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4">
          {additionalInfo ? (
            <div>
              <p className="text-sm font-medium">{additionalInfo.label}</p>
              <p className="text-lg font-semibold">{additionalInfo.value}</p>
            </div>
          ) : (
            <p>No additional info available.</p>
          )}
        </div>
        <DrawerFooter className="flex justify-end">
          <DrawerClose asChild>
            <button className="text-primary font-medium">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 