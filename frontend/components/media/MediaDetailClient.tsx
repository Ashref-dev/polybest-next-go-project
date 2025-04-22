"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, PlayCircle, Clock, Calendar, Share2, Plus, Star } from "lucide-react";

// Import types
import { Series, Movie, Anime } from "@/types";

// Import UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import media player components
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { VideoPlaceholder } from "@/components/media/VideoPlaceholder";

// Episodes interface for series and anime
interface Episode {
  number: number;
  title: string;
  duration: string;
  watchUrl: string;
}

interface MediaDetailClientProps {
  mediaData: Movie | Series | Anime;
  mediaType: "movies" | "series" | "anime";
}

export function MediaDetailClient({ mediaData, mediaType }: MediaDetailClientProps) {
  // Debug: Log incoming props
  console.log('[MediaDetailClient] mediaType:', mediaType);
  console.log('[MediaDetailClient] mediaData:', mediaData);

  const router = useRouter();
  const [activeEpisode, setActiveEpisode] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [episodeSearch, setEpisodeSearch] = useState<string>("");
  
  // Mock episode data (in a real app, this would come from the API)
  const generateEpisodes = (mediaData: Movie | Series | Anime): Episode[] => {
    if (mediaType === "movies") return [];
    
    // For series, use the episodes from the API
    if (mediaType === "series") {
      const series = mediaData as Series;
      console.log('[generateEpisodes] series.episodes:', series.episodes);
      const result = Array.isArray(series.episodes)
        ? series.episodes.map(ep => ({
            number: ep.id,
            title: ep.title || `Episode ${ep.id}`,
            duration: "45:00", // Mock duration since API doesn't provide it
            watchUrl: ep.watchUrl
          }))
        : [];
      console.log('[generateEpisodes] result:', result);
      return result;
    }
    
    // For anime, use the episodeList from the API
    if (mediaType === "anime") {
      const anime = mediaData as Anime;
      console.log('[generateEpisodes] anime.episodeList:', anime.episodeList);
      const result = Array.isArray(anime.episodeList)
        ? anime.episodeList.map(ep => ({
            number: ep.id,
            title: ep.title || `Episode ${ep.id}`,
            duration: "24:00", // Mock duration since API doesn't provide it
            watchUrl: ep.watchUrl
          }))
        : [];
      console.log('[generateEpisodes] result:', result);
      return result;
    }
    
    return [];
  };
  
  const episodes = generateEpisodes(mediaData);
  console.log('[MediaDetailClient] episodes:', episodes);
  
  // Determine if this is a series with episodes
  const hasEpisodes = mediaType === "series" || mediaType === "anime";
  
  // Get the current episode data
  const currentEpisode = episodes.find(ep => ep.number === activeEpisode) || episodes[0];
  
  // Toggle play/pause - start the actual video when the play button is clicked
  const handlePlayClick = () => {
    setIsPlaying(true);
  };
  
  // Get cover URL based on media type
  const getCoverUrl = (): string => {
    if (mediaType === "movies") {
      return (mediaData as Movie).CoverURL || "/media-placeholder.jpg";
    } else if (mediaType === "series") {
      return (mediaData as Series).coverUrl || "/media-placeholder.jpg";
    } else if (mediaType === "anime") {
      return (mediaData as Anime).coverUrl || "/media-placeholder.jpg";
    }
    
    return "/media-placeholder.jpg";
  };
  
  // Extract information based on media type
  const getTitle = (): string => {
    if (mediaType === "movies") {
      return (mediaData as Movie).Title;
    } else if (mediaType === "series") {
      return (mediaData as Series).title;
    } else if (mediaType === "anime") {
      return (mediaData as Anime).title;
    }
    
    return "";
  };
  
  const getGenre = (): string => {
    if (mediaType === "movies") {
      return (mediaData as Movie).Genre;
    } else if (mediaType === "series" || mediaType === "anime") {
      return (mediaData as Series | Anime).genre;
    }
    
    return "";
  };
  
  const getYear = (): number | string => {
    if (mediaType === "movies") {
      return (mediaData as Movie).Year;
    }
    
    return "";
  };
  
  const getEpisodeCount = (): number => {
    if (mediaType === "series") {
      return (mediaData as Series).totalEpisodes;
    } else if (mediaType === "anime") {
      return (mediaData as Anime).episodes;
    }
    
    return 0;
  };

  // Filter episodes based on search term
  const filteredEpisodes = useMemo(() => {
    if (!episodeSearch.trim()) return episodes;
    
    return episodes.filter(ep => 
      ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) || 
      ep.number.toString().includes(episodeSearch)
    );
  }, [episodes, episodeSearch]);

  return (
    <div className="min-h-screen pb-16">
      {/* Back button */}
      <div className="bg-background/80 backdrop-blur-sm sticky top-16 z-20 border-b">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </Button>
        </div>
      </div>

      {/* Media Player Section - Show placeholder or actual player based on isPlaying state */}
      <section className="bg-black rounded-md relative max-w-7xl mx-auto">
        {isPlaying ? (
          <VideoPlayer 
            coverUrl={getCoverUrl()}
            mediaTitle={getTitle()}
            mediaType={mediaType}
            episode={hasEpisodes && currentEpisode ? currentEpisode : undefined}
            episodeList={hasEpisodes ? episodes : undefined}
            onEpisodeChange={setActiveEpisode}
          />
        ) : (
          <VideoPlaceholder 
            coverUrl={getCoverUrl()}
            title={getTitle()}
            onPlayClick={handlePlayClick}
            className="cursor-pointer"
          />
        )}
      </section>

      {/* Media Details */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{getTitle()}</h1>
                  <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                    <Badge variant="secondary">{getGenre()}</Badge>
                    {getYear() && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {getYear()}
                      </span>
                    )}
                    {hasEpisodes && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {getEpisodeCount()} Episodes
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus size={16} />
                    <span>Watchlist</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Share2 size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Copy Link</DropdownMenuItem>
                      <DropdownMenuItem>Share to Twitter</DropdownMenuItem>
                      <DropdownMenuItem>Share to Facebook</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {hasEpisodes && (
                    <TabsTrigger value="episodes">Episodes</TabsTrigger>
                  )}
                  <TabsTrigger value="related">Related</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="px-2 py-1 bg-primary/10">
                            <Star className="h-3.5 w-3.5 mr-1 fill-primary text-primary" />
                            <span>8.6</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            User Rating
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {mediaType === "series" && (
                            <>
                              Mark Grayson is a normal teenager except for the fact that his father is the most powerful superhero on the planet. Shortly after his seventeenth birthday, Mark begins to develop powers of his own and enters into his father&apos;s tutelage.
                            </>
                          )}
                          
                          {mediaType === "anime" && (
                            <>
                              In a world where demons feed on unsuspecting humans, fragments of the legendary and feared demon Ryomen Sukuna were lost and scattered about. Should any demon consume Sukuna&apos;s body parts, the power they gain could destroy the world as we know it.
                            </>
                          )}
                          
                          {mediaType === "movies" && (
                            <>
                              Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable.
                            </>
                          )}
                        </p>
                        
                        <div className="pt-4">
                          <h3 className="text-sm font-medium mb-2">Production</h3>
                          <p className="text-sm text-muted-foreground">
                            {mediaType === "series" && "Amazon Studios"}
                            {mediaType === "anime" && "MAPPA Studio"}
                            {mediaType === "movies" && "Warner Bros. Pictures"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {hasEpisodes && (
                  <TabsContent value="episodes" className="mt-4">
                    <Card>
                      <CardContent className={episodes.length > 0 ? "p-0" : "p-6"}>
                        {episodes.length > 0 ? (
                          <>
                            <div className="p-4 border-b">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Season 1</h3>
                                <Badge variant="outline">{episodes.length} Episodes</Badge>
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Search episodes..."
                                  value={episodeSearch}
                                  onChange={(e) => setEpisodeSearch(e.target.value)}
                                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-transparent placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                              </div>
                            </div>
                            <ScrollArea className="h-[500px]">
                              <div className="divide-y">
                                {filteredEpisodes.length > 0 ? (
                                  filteredEpisodes.map((episode) => (
                                    <div 
                                      key={episode.number}
                                      onClick={() => {
                                        setActiveEpisode(episode.number);
                                        if (!isPlaying) {
                                          setIsPlaying(true);
                                        }
                                      }}
                                      className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                                        activeEpisode === episode.number ? "bg-muted/30" : ""
                                      }`}
                                    >
                                      <div className="flex-shrink-0 mr-4 font-semibold text-lg w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                        {episode.number}
                                      </div>
                                      <div className="flex-shrink-0 mr-4 relative w-24 h-16 overflow-hidden rounded-md">
                                        <Image 
                                          src={getCoverUrl()} 
                                          alt={episode.title}
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors">
                                          <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/70 h-8 w-8" />
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-medium text-base">{episode.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                          <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {episode.duration}
                                          </span>
                                          <Badge variant="outline" className="px-1.5 py-0 text-xs">HD</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                          {mediaType === "series" && "Watch Mark Grayson as he continues his journey to becoming Invincible and learns the truth about his father."}
                                          {mediaType === "anime" && "Yuji Itadori encounters powerful curses as he continues his journey at Jujutsu High."}
                                        </p>
                                      </div>
                                      <div className="ml-4 flex-shrink-0">
                                        {activeEpisode === episode.number ? (
                                          <Button size="sm" variant="default" className="gap-2">
                                            <PlayCircle size={16} />
                                            <span>Now Playing</span>
                                          </Button>
                                        ) : (
                                          <Button size="sm" variant="outline" className="gap-2">
                                            <PlayCircle size={16} />
                                            <span>Play</span>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-8 text-center">
                                    <p className="text-muted-foreground">No episodes match your search.</p>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </>
                        ) : (
                          <div className="text-center py-10 px-4">
                            <h3 className="text-lg font-medium mb-2">No Episodes Available</h3>
                            <p className="text-muted-foreground">
                              There are no episodes available for this {mediaType === "series" ? "series" : "anime"} yet.
                              Check back later for updates.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
                
                <TabsContent value="related" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground">
                        Related content not available.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Side Content */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <Card>
                <CardContent className="p-4">
                  <div className="aspect-[2/3] relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src={getCoverUrl()}
                      alt={getTitle()}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {mediaType === "series" && "Returning Series"}
                        {mediaType === "anime" && "Ongoing"}
                        {mediaType === "movies" && "Released"}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Release Date</h3>
                      <p className="text-sm text-muted-foreground">
                        {mediaType === "series" && "Mar 25, 2021 - Mar 13, 2025"}
                        {mediaType === "anime" && "Oct 3, 2020 - Present"}
                        {mediaType === "movies" && getYear()}
                      </p>
                    </div>
                    
                    {hasEpisodes && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium mb-1">Episodes</h3>
                          <p className="text-sm text-muted-foreground">
                            {getEpisodeCount()} Episodes
                          </p>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    <div>
                      <Button 
                        className="w-full gap-2"
                        onClick={handlePlayClick}
                        disabled={hasEpisodes && episodes.length === 0}
                      >
                        <PlayCircle size={18} />
                        {hasEpisodes && currentEpisode 
                          ? `Watch Episode ${activeEpisode}` 
                          : hasEpisodes && episodes.length === 0 
                            ? "No Episodes Available" 
                            : "Watch Now"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 