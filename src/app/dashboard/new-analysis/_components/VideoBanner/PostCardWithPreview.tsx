"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, ExternalLink, Eye, FileText, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NetworkScrap } from "@/types/network"
import { parseMediaUrl, parseMediaUrlWithOG, MediaMetadata } from "./utils/mediaUtils"
import PostPreviewModal from "./PostPreviewModal"
// Import from the consolidated store
import { useNewAnalysisFormStore, OgCacheEntry } from "@/store/newAnalysisFormStore";

interface PostCardWithPreviewProps {
  post: NetworkScrap
  isSelected: boolean
  onToggle: () => void
}

const PostCardWithPreview = ({ post, isSelected, onToggle }: PostCardWithPreviewProps) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Get the action from the consolidated store
  const setPostOgDataInStore = useNewAnalysisFormStore((state) => state.setPostOgDataForCurrentActiveFetched);

  // Directly use post.ogData for metadata and status (type OgCacheEntry | undefined from NetworkScrap)
  const ogStatus = post.ogData?.status;
  const fetchedOgData = post.ogData?.status === 'success' ? post.ogData.data : null;
  const ogError = post.ogData?.status === 'error' ? post.ogData.error : null;

  // Start with basic metadata derived from post info
  const baseMetadata = parseMediaUrl(post.url, post.keyword, post.social_network);

  // Create displayMetadata, ensuring it's always MediaMetadata type
  // Override with fetched OG data if available and successful
  const displayMetadata: MediaMetadata = {
    ...baseMetadata, // Start with base
    ...(fetchedOgData && { // If OG data was successfully fetched
      title: fetchedOgData.title || baseMetadata.title, // Use OG title or fallback to base
      description: fetchedOgData.description || baseMetadata.description, // Use OG desc or fallback
      thumbnailUrl: fetchedOgData.thumbnailUrl || baseMetadata.thumbnailUrl, // Use OG image as thumbnail or fallback
      // other properties from OgData like duration, views might not directly map or exist
      // so we primarily focus on title, description, image.
      // If OgData has more fields that should override MediaMetadata fields, add them here.
    })
  };

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [displayMetadata.thumbnailUrl])

  const fetchOgDataIfNeeded = useCallback(async () => {
    if (!post.url || post.ogData?.status === 'success' || post.ogData?.status === 'pending') {
      return;
    }
    // Set status to pending in the store
    setPostOgDataInStore(post.url, { status: 'pending' } as OgCacheEntry);
    try {
      const fetchedOgMetadata = await parseMediaUrlWithOG(post.url, post.keyword, post.social_network);
      // Cast to OgData if parseMediaUrlWithOG returns a slightly different type that's compatible
      setPostOgDataInStore(post.url, { status: 'success', data: fetchedOgMetadata as any } as OgCacheEntry);
    } catch (error) {
      console.warn(`Failed to fetch OG data for ${post.url}, using basic metadata:`, error);
      setPostOgDataInStore(post.url, { status: 'error', error } as OgCacheEntry);
    }
  }, [post.url, post.keyword, post.social_network, post.ogData?.status, setPostOgDataInStore]);

  useEffect(() => {
    fetchOgDataIfNeeded();
  }, [fetchOgDataIfNeeded]);

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
      case 'facebook meta':
        return 'bg-blue-500'
      case 'instagram':
      case 'instagram meta':
        return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'tiktok':
        return 'bg-black'
      default:
        return 'bg-gray-500'
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const openPostInNewTab = () => {
    window.open(post.url, '_blank')
  }

  const handleThumbnailClick = () => {
    setShowPreviewModal(true)
  }

  const isLoadingOG = ogStatus === 'pending';

  return (
    <>
      <div
        className={`group relative rounded-xl border p-4 transition-all duration-200 hover:shadow-lg ${isSelected ? "border-primary bg-primary/5 shadow-md" : "hover:border-gray-300"
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start space-x-4">
          <div
            className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer shadow-sm"
            onClick={handleThumbnailClick}
          >
            {!imageError && displayMetadata.thumbnailUrl ? (
              <>
                {(isLoadingOG || !imageLoaded) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                )}
                <img
                  key={displayMetadata.thumbnailUrl}
                  src={displayMetadata.thumbnailUrl}
                  alt={displayMetadata.title || 'Post thumbnail'}
                  className={`h-full w-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                    } ${isHovered ? 'scale-105' : 'scale-100'}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                {isLoadingOG ? <Loader2 className="h-6 w-6 text-gray-400 animate-spin" /> : <FileText className="h-8 w-8 text-gray-400" />}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {displayMetadata.duration && (
              <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {displayMetadata.duration}
              </div>
            )}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isHovered ? 'bg-black/20' : 'bg-black/10'
              }`}>
              <div className={`rounded-full bg-white/90 p-3 shadow-lg transition-all duration-200 ${isHovered ? 'scale-110 bg-white' : 'scale-100'
                }`}>
                <Play className="h-4 w-4 text-gray-800 fill-gray-800" />
              </div>
            </div>
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className={`text-xs text-white shadow-sm ${getPlatformColor(displayMetadata.platform)}`}
              >
                {displayMetadata.platform.charAt(0).toUpperCase() + displayMetadata.platform.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <h4
                  className="font-medium text-sm leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={handleThumbnailClick}
                >
                  {isLoadingOG && !displayMetadata.title ? (
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  ) : (
                    displayMetadata.title || (post.url ? "Loading title..." : "No URL provided")
                  )}
                </h4>
                <div className="mt-2 flex items-center space-x-3">
                  {(displayMetadata.views || (isLoadingOG && !ogError)) && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {isLoadingOG && !displayMetadata.views && !ogError ? <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div> : `${displayMetadata.views || '-'} views`}
                    </span>
                  )}
                  {(displayMetadata.duration || (isLoadingOG && !ogError)) && (
                    <span className="text-xs text-muted-foreground">
                      {isLoadingOG && !displayMetadata.duration && !ogError ? <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div> : displayMetadata.duration || '-'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={handleThumbnailClick}
                  title="Preview post"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={openPostInNewTab}
                  title="Open post in new tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggle}
                  id={`post-${post.url}`}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Keyword:</span>
                <Badge variant="outline" className="text-xs">
                  {post.keyword}
                </Badge>
              </div>
              {(displayMetadata.description || (isLoadingOG && !ogError)) && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {isLoadingOG && !displayMetadata.description && !ogError ? <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div> : displayMetadata.description || "No description available."}
                </p>
              )}
              {ogError && (
                <p className="text-xs text-red-500 line-clamp-1">
                  Error loading preview data.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPreviewModal && (
        <PostPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          post={post}
          postMetadata={displayMetadata}
        />
      )}
    </>
  )
}

export default PostCardWithPreview; 
