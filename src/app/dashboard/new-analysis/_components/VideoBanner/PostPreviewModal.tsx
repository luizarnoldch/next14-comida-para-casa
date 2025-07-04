"use client"

import { useState } from "react"
import { X, ExternalLink, Play, Clock, Eye, Tag, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NetworkScrap } from "@/types/network"
import { MediaMetadata } from "./utils/mediaUtils"

interface PostPreviewModalProps {
  post: NetworkScrap | null
  postMetadata: MediaMetadata
  isOpen: boolean
  onClose: () => void
  onSelect?: () => void
  isSelected?: boolean
  isLoadingOG?: boolean
}

const PostPreviewModal = ({
  post,
  postMetadata,
  isOpen, 
  onClose, 
  onSelect, 
  isSelected = false,
  isLoadingOG = false
}: PostPreviewModalProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!post) return null

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'bg-blue-500'
      case 'instagram':
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Post Preview</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-6 max-h-[85vh] overflow-y-auto">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg max-h-[50vh]">
            {!imageError ? (
              <>
                {(isLoadingOG || !imageLoaded) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                )}
                <img
                  src={postMetadata.thumbnailUrl}
                  alt={postMetadata.title || 'Post thumbnail'}
                  className={`h-full w-full object-contain transition-opacity duration-300 ${
                    imageLoaded && !isLoadingOG ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  style={{ maxHeight: '50vh' }}
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {(imageLoaded && !isLoadingOG && !imageError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100 cursor-pointer" onClick={() => window.open(post?.url, '_blank')}>
                <div className="rounded-full bg-white/95 p-6 shadow-xl">
                  <Play className="h-8 w-8 text-gray-800 fill-gray-800" />
                </div>
              </div>
            )}
            
            {postMetadata.duration && (
              <div className="absolute bottom-4 right-4 rounded-lg bg-black/80 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {postMetadata.duration}
              </div>
            )}

            <div className="absolute top-4 left-4">
              <Badge 
                variant="secondary" 
                className={`text-sm text-white shadow-lg ${getPlatformColor(postMetadata.platform)}`}
              >
                {postMetadata.platform.charAt(0).toUpperCase() + postMetadata.platform.slice(1)}
              </Badge>
            </div>

            {isLoadingOG && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-xs text-white">Loading preview...</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold leading-tight mb-3">
                {isLoadingOG ? (
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                ) : (
                  postMetadata.title
                )}
              </h3>
              <div className="flex items-center space-x-4">
                {postMetadata.views && !isLoadingOG && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">{postMetadata.views} views</span>
                  </div>
                )}
                {postMetadata.duration && !isLoadingOG && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{postMetadata.duration}</span>
                  </div>
                )}
                {isLoadingOG && (
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                )}
              </div>
            </div>

            {postMetadata.description && !isLoadingOG && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {postMetadata.description}
                </p>
              </div>
            )}

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Keyword:</span>
                <Badge variant="outline" className="font-medium">{post.keyword}</Badge>
              </div>
              <div className="flex items-start space-x-3">
                <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-muted-foreground">Source:</span>
                  <a 
                    href={post.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline break-all mt-1"
                  >
                    {post.url}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-6 pt-4 border-t -mx-6">
             <div className="flex space-x-3">
                <Button 
                  onClick={openPostInNewTab}
                  variant="outline" 
                  className="flex-1"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </Button>
                {onSelect && (
                  <Button 
                    onClick={onSelect} 
                    variant={isSelected ? "secondary" : "default"}
                    className="flex-1"
                    size="lg"
                  >
                    {isSelected ? "Remove from Analysis" : "Add to Analysis"}
                  </Button>
                )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostPreviewModal 