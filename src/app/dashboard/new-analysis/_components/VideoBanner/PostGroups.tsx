"use client"

import React from "react"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiOutlineFacebook } from "react-icons/ai"
import { SlSocialInstagram } from "react-icons/sl"
import PostCardWithPreview from "./PostCardWithPreview"
import PostCardSkeleton from "./PostCardSkeleton"
import { Button } from "@/components/ui/button"
import { NetworkScrap } from "@/types/network"
import { useNewAnalysisFormStore, PostToAnalyze } from "@/store/newAnalysisFormStore";

type SocialKey = "facebook meta" | "instagram meta" | "tiktok"
const SOCIAL_KEYS: SocialKey[] = ["facebook meta", "instagram meta", "tiktok"]

const TAB_DISPLAY: Record<SocialKey, { icon: React.ReactNode; label: string; }> = {
  "facebook meta": { icon: <AiOutlineFacebook className="h-4 w-4" />, label: "Facebook" },
  "instagram meta": { icon: <SlSocialInstagram className="h-4 w-4" />, label: "Instagram" },
  tiktok: {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    label: "TikTok",
  },
}

const groupPostsBySocial = (posts: NetworkScrap[]): Partial<Record<SocialKey, NetworkScrap[]>> => {
  return posts.reduce((acc, post) => {
    const socialKey = post.social_network.toLowerCase() as SocialKey;
    if (!acc[socialKey]) acc[socialKey] = [];
    acc[socialKey]!.push(post);
    return acc;
  }, {} as Partial<Record<SocialKey, NetworkScrap[]>>);
}

const PostGroups: React.FC<{}> = () => {
  const isLoading = useNewAnalysisFormStore((state) => state.isLoading);
  const fetchedPosts = useNewAnalysisFormStore((state) => state.currentActiveFetchedPosts);
  const selectedPostsInActiveDetail = useNewAnalysisFormStore((state) => 
    state.search_details[state.active_search_detail_idx]?.posts_to_analyze || []
  );

  const toggleSelectAll = useNewAnalysisFormStore((state) => state.toggleSelectAllInCurrentFetched);
  const clearSelected = useNewAnalysisFormStore((state) => state.clearSelectedPostsForActiveDetail);
  const setIsPostSelected = useNewAnalysisFormStore((state) => state.setIsPostSelectedInActiveDetail);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Posts...</CardTitle>
          <CardDescription>Searching for posts based on your keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="facebook meta">
            <TabsList className="grid w-full grid-cols-3">
              {SOCIAL_KEYS.map((social) => (
                <TabsTrigger key={social} value={social} className="flex items-center gap-2">
                  {TAB_DISPLAY[social].icon} {TAB_DISPLAY[social].label}
                </TabsTrigger>
              ))}
            </TabsList>
            {SOCIAL_KEYS.map((social) => (
              <TabsContent key={social} value={social} className="space-y-3 mt-4">
                {Array.from({ length: 3 }).map((_, index) => (<PostCardSkeleton key={index} />))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  if (fetchedPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Start your analysis</CardTitle>
          <CardDescription>Enter keywords on the left panel to search for posts.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const allCurrentlySelectedInView = fetchedPosts.length > 0 && 
    fetchedPosts.every((post: NetworkScrap) => 
        selectedPostsInActiveDetail.some((sp: PostToAnalyze) => sp.url === post.url)
    );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Posts to Analyze</CardTitle>
            <CardDescription>
              {selectedPostsInActiveDetail.length} of {fetchedPosts.length} post{fetchedPosts.length !== 1 ? "s" : ""} shown are selected.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleSelectAll} disabled={fetchedPosts.length === 0}>
              <Check className="mr-1 h-4 w-4" />
              {allCurrentlySelectedInView ? "Deselect All" : "Select All Shown"}
            </Button>
            {selectedPostsInActiveDetail.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearSelected}>
                <X className="mr-1 h-4 w-4" /> Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto flex-grow">
        <Tabs defaultValue="facebook meta" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3">
            {SOCIAL_KEYS.map((social) => {
              const count = fetchedPosts.filter((post: NetworkScrap) => post.social_network.toLowerCase() === social).length || 0;
              return (
                <TabsTrigger key={social} value={social} className="flex items-center gap-2" disabled={count === 0}>
                  {TAB_DISPLAY[social].icon} {TAB_DISPLAY[social].label}
                  {count > 0 && (<span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">{count}</span>)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {SOCIAL_KEYS.map((social) => {
            const postsForSocial = fetchedPosts.filter((post: NetworkScrap) => post.social_network.toLowerCase() === social);
            return (
              <TabsContent key={social} value={social} className="space-y-4 mt-4 flex-grow overflow-y-auto">
                {postsForSocial.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground italic">
                    No posts found for {TAB_DISPLAY[social].label} from the current keyword search.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {postsForSocial.map((post, index) => (
                      <PostCardWithPreview 
                        key={post.url + index} 
                        post={post} 
                        isSelected={selectedPostsInActiveDetail.some((p: PostToAnalyze) => p.url === post.url)}
                        onToggle={() => setIsPostSelected(post as PostToAnalyze, !selectedPostsInActiveDetail.some((p: PostToAnalyze) => p.url === post.url))}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PostGroups; 