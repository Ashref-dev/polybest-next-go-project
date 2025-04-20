"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Episode {
  number: number;
  title: string;
  duration: string;
}

interface VideoPlayerProps {
  coverUrl: string;
  mediaTitle: string;
  mediaType: "movies" | "series" | "anime";
  episode?: Episode;
  episodeList?: Episode[];
  onEpisodeChange?: (episodeNumber: number) => void;
}

export function VideoPlayer({
  coverUrl,
  mediaTitle,
  mediaType,
  episode,
  episodeList,
  onEpisodeChange
}: VideoPlayerProps) {
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video source - in a real implementation, this would come from your API
  const getVideoSource = () => {
    switch (mediaType) {
      case "movies":
        return "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
      case "series":
      case "anime":
        return `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4?episode=${episode?.number || 1}`;
      default:
        return "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const vol = newVolume[0];
      setVolume(vol);
      videoRef.current.volume = vol / 100;
      setIsMuted(vol === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      videoRef.current.muted = newMuteState;
    }
  };

  // Handle seeking
  const handleSeek = (newTime: number[]) => {
    if (videoRef.current) {
      const time = newTime[0];
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Handle episode change
  const handleEpisodeChange = (direction: "prev" | "next") => {
    if (!episodeList || !episode || !onEpisodeChange) return;
    
    const currentIndex = episodeList.findIndex(ep => ep.number === episode.number);
    if (currentIndex === -1) return;
    
    if (direction === "next" && currentIndex < episodeList.length - 1) {
      onEpisodeChange(episodeList[currentIndex + 1].number);
    } else if (direction === "prev" && currentIndex > 0) {
      onEpisodeChange(episodeList[currentIndex - 1].number);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Show/hide controls with mouse movement
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Event listeners for video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const onTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const onDurationChange = () => {
      setDuration(videoElement.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      // Auto-play next episode if available
      if (mediaType === "series" || mediaType === "anime") {
        handleEpisodeChange("next");
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onPlaying = () => {
      setIsLoading(false);
    };

    const onLoadedData = () => {
      setIsLoading(false);
      // Auto-play when video is loaded
      videoElement.play().catch(error => {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      });
    };

    // Add event listeners
    videoElement.addEventListener("timeupdate", onTimeUpdate);
    videoElement.addEventListener("durationchange", onDurationChange);
    videoElement.addEventListener("ended", onEnded);
    videoElement.addEventListener("play", onPlay);
    videoElement.addEventListener("pause", onPause);
    videoElement.addEventListener("waiting", onWaiting);
    videoElement.addEventListener("playing", onPlaying);
    videoElement.addEventListener("loadeddata", onLoadedData);

    // Fullscreen change event
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    // Clean up event listeners
    return () => {
      videoElement.removeEventListener("timeupdate", onTimeUpdate);
      videoElement.removeEventListener("durationchange", onDurationChange);
      videoElement.removeEventListener("ended", onEnded);
      videoElement.removeEventListener("play", onPlay);
      videoElement.removeEventListener("pause", onPause);
      videoElement.removeEventListener("waiting", onWaiting);
      videoElement.removeEventListener("playing", onPlaying);
      videoElement.removeEventListener("loadeddata", onLoadedData);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [mediaType, episode, handleEpisodeChange]);

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      ref={playerContainerRef}
      className={cn(
        "relative w-full aspect-video max-h-[calc(100vh-200px)] bg-black",
        isFullscreen && "max-h-none h-screen"
      )}
      onMouseMove={showControlsTemporarily}
      onClick={() => {
        if (!showControls) {
          showControlsTemporarily();
        }
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={getVideoSource()}
        className="w-full h-full object-contain"
        poster={coverUrl}
        preload="metadata"
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls overlay */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Top bar - Title */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center">
            <h3 className="text-white font-medium truncate">
              {mediaTitle}
              {episode && (
                <span className="opacity-70 ml-2">
                  S1:E{episode.number} - {episode.title}
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Center play/pause button */}
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-4 transition-all"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 text-white" />
          ) : (
            <Play className="w-10 h-10 text-white" />
          )}
        </button>

        {/* Bottom control bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="mb-2"
          />

          {/* Controls row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              {/* Play/Pause button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              {/* Previous/Next buttons (for series/anime) */}
              {(mediaType === "series" || mediaType === "anime") && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleEpisodeChange("prev")}
                    disabled={!episode || episode.number === 1}
                  >
                    <SkipBack size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleEpisodeChange("next")}
                    disabled={!episodeList || !episode || episode.number === episodeList.length}
                  >
                    <SkipForward size={20} />
                  </Button>
                </>
              )}

              {/* Time display */}
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>

              {/* Fullscreen toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 