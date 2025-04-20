import Image from "next/image";
import Link from "next/link";
import { StarIcon, TvIcon, EyeIcon, InfoIcon } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

export interface ModernMediaCardProps {
  id: number;
  title: string;
  genre?: string;
  description?: string;
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
  description,
  type,
  imageSrc = "/placeholder-media.jpg",
  additionalInfo,
}: ModernMediaCardProps) {
  const mediaType =
    type === "movie" ? "movies" : type === "series" ? "series" : "anime";
  const detailUrl = `/${mediaType}/${id}`;
  const IconComponent =
    type === "movie" ? StarIcon : type === "series" ? TvIcon : EyeIcon;

  // Type badge color
  const typeBadge = {
    movie: {
      label: "Movie",
      className: "bg-red-600/90 text-white",
    },
    series: {
      label: "Series",
      className: "bg-blue-600/90 text-white",
    },
    anime: {
      label: "Anime",
      className: "bg-purple-600/90 text-white",
    },
  }[type];

  return (
    <Drawer>
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
            <div className="absolute bottom-4 left-4 text-white flex flex-col gap-1">
              <h3 className="text-2xl font-semibold leading-tight drop-shadow-lg">{title}</h3>
              {genre && <span className="text-sm opacity-90 bg-black/60 rounded px-2 py-0.5 w-fit">{genre}</span>}
            </div>
            <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full">
              <IconComponent size={16} className="text-white" />
            </div>
            <span className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${typeBadge.className}`}>{typeBadge.label}</span>
          </div>
        </Link>
        <DrawerTrigger asChild>
          <button className="absolute top-4 left-4 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow hover:bg-white/90 transition-colors">
            <InfoIcon className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Large Cover Image */}
          <div className="relative w-full aspect-[16/5] rounded-2xl overflow-hidden mt-8 shadow-xl">
            <Image
              src={imageSrc!}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1600px) 100vw, 1600px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-12 flex flex-col gap-3 text-white">
              <div className="flex items-center gap-4">
                <h2 className="text-5xl font-extrabold tracking-tight drop-shadow-lg mb-1">{title}</h2>
                <span className={`px-4 py-1 rounded-full text-lg font-bold shadow-lg ${typeBadge.className}`}>{typeBadge.label}</span>
                <span className="inline-block align-middle ml-2">
                  <IconComponent size={36} className="inline text-white/80" />
                </span>
              </div>
              {genre && <span className="inline-block text-xl font-semibold bg-black/60 rounded px-4 py-1 mr-2 mb-2 w-fit">{genre}</span>}
            </div>
          </div>
          {/* Details Section */}
          <div className="w-full px-12 py-12 flex flex-col gap-12 items-start">
            {description && (
              <div>
                <h3 className="text-3xl font-bold mb-4 text-foreground">Description</h3>
                <p className="text-2xl text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
              </div>
            )}
            {additionalInfo && (
              <div>
                <h3 className="text-3xl font-bold mb-4 text-foreground">{additionalInfo.label}</h3>
                <p className="text-4xl font-extrabold text-primary drop-shadow">{additionalInfo.value}</p>
              </div>
            )}
          </div>
        </div>
        <DrawerFooter className="flex justify-end w-full max-w-4xl mx-auto pb-10">
          <DrawerClose asChild>
            <button className="text-2xl px-10 py-4 rounded-lg bg-primary text-primary-foreground font-bold shadow hover:bg-primary/90 transition">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
