import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, Tag, PlayCircle, X } from "lucide-react";
import { motion } from "framer-motion";

interface SortOption {
  value: string;
  label: string;
}

interface MediaFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOptions: SortOption[];
  selectedGenre?: string;
  setSelectedGenre?: (genre: string) => void;
  genres?: string[];
  hasEpisodeFilter?: boolean;
  episodeRange?: number[];
  setEpisodeRange?: (range: number[]) => void;
  maxEpisodes?: number;
}

export function MediaFilters({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOptions,
  selectedGenre,
  setSelectedGenre,
  genres = [],
  hasEpisodeFilter = false,
  episodeRange = [0, 100],
  setEpisodeRange,
  maxEpisodes = 100,
}: MediaFiltersProps) {
  return (
    <motion.section 
      className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg p-5 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 backdrop-blur-sm border-muted/50 focus:border-primary/50"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium whitespace-nowrap flex items-center gap-1">
                <ArrowUpDown size={14} />
                Sort:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] bg-background/50 backdrop-blur-sm border-muted/50 focus:border-primary/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedGenre !== undefined && setSelectedGenre && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap flex items-center gap-1">
                  <Tag size={14} />
                  Genre:
                </span>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm border-muted/50 focus:border-primary/50">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[240px]">
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        
        {hasEpisodeFilter && setEpisodeRange && (
          <div className="pt-2 border-t border-muted/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-muted-foreground font-medium whitespace-nowrap flex items-center gap-1">
                <PlayCircle size={14} />
                Episodes:
              </span>
              <span className="text-sm bg-background/40 px-2 py-0.5 rounded-md">
                {episodeRange[0]} - {episodeRange[1] === 100 ? maxEpisodes : episodeRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={episodeRange}
              onValueChange={setEpisodeRange}
              className="max-w-md"
            />
          </div>
        )}
        
        {selectedGenre && selectedGenre !== "all" && setSelectedGenre && (
          <div className="flex items-center gap-2 pt-2 border-t border-muted/20">
            <span className="text-sm font-medium">Active filters:</span>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary"
            >
              {selectedGenre}
              <button
                onClick={() => setSelectedGenre("all")}
                className="ml-2 rounded-full hover:bg-primary/20 p-1 h-4 w-4 flex items-center justify-center"
                aria-label="Remove filter"
              >
                <X size={10} />
              </button>
            </Badge>
          </div>
        )}
      </div>
    </motion.section>
  );
} 