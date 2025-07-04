import { Skeleton } from "@/components/ui/skeleton"

const PostCardSkeleton = () => {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start space-x-4">
        {/* Thumbnail skeleton */}
        <Skeleton className="h-20 w-32 flex-shrink-0 rounded-md" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              {/* Title skeleton */}
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              
              {/* Platform and views skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            
            {/* Checkbox skeleton */}
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          
          {/* Keyword skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCardSkeleton 