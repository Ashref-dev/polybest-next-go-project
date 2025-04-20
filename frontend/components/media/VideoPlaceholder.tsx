"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EpisodeInfo {
  season: number;
  episode: number;
  title: string;
  duration: string;
}

interface VideoPlaceholderProps {
  coverUrl: string;
  title: string;
  onPlayClick: () => void;
  className?: string;
  episodeInfo?: EpisodeInfo;
}

export function VideoPlaceholder({
  coverUrl,
  title,
  onPlayClick,
  className,
  episodeInfo,
}: VideoPlaceholderProps) {
  return (
    <div 
      className={cn(
        "relative w-full aspect-video max-h-[calc(100vh-200px)] bg-black cursor-pointer group",
        className
      )}
      onClick={onPlayClick}
      role="button"
      aria-label={`Play ${title}`}
    >
      {/* Cover Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        {/* Gradient overlay to improve text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-white/10 backdrop-blur-sm p-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
          <Play className="w-12 h-12 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Title and Episode Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">{title}</h2>
        {episodeInfo && (
          <div className="mt-1 text-white/80 text-sm">
            S{episodeInfo.season}:E{episodeInfo.episode} - {episodeInfo.title} ({episodeInfo.duration})
          </div>
        )}
      </div>
    </div>
  );
} 