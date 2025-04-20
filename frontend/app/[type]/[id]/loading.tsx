import { MediaDetailSkeleton } from "@/components/media/MediaDetailSkeleton";

export default function Loading() {
  // Since we don't know the media type at this point, we'll assume it might have episodes
  return <MediaDetailSkeleton hasEpisodes={true} />;
} 