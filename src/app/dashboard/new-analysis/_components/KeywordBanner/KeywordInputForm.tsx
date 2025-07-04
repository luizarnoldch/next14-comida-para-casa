'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisCategory, SearchDetail, useNewAnalysisFormStore } from '@/store/newAnalysisFormStore';
import { fetchNetworkScrap } from '@/services/scraperService';
import { NetworkScrap } from '@/types/network';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from 'lucide-react';

interface KeywordInputFormProps {
  detailIndex: number;
  searchDetail: SearchDetail;
  category: AnalysisCategory;
  updateKeywords: (kw_main: string, kw_secondary: string[]) => void;
}

const KeywordInputForm: React.FC<KeywordInputFormProps> = ({
  detailIndex,
  searchDetail,
  category,
  updateKeywords
}) => {
  const [kwMain, setKwMain] = useState(searchDetail.kw_main || "");
  const [kwSecondary, setKwSecondary] = useState<string[]>(searchDetail.kw_secondary || []);
  const [isManualMode, setIsManualMode] = useState(searchDetail.search_type === 'manual');
  const [singleUrl, setSingleUrl] = useState('');
  const [description, setDescription] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');

  const setIsLoading = useNewAnalysisFormStore((state) => state.setIsLoading);
  const setCurrentActiveFetchedPosts = useNewAnalysisFormStore((state) => state.setCurrentActiveFetchedPosts);
  const clearSelectedPostsForActiveDetail = useNewAnalysisFormStore((state) => state.clearSelectedPostsForActiveDetail);
  const clearCurrentActiveFetchedPosts = useNewAnalysisFormStore((state) => state.clearCurrentActiveFetchedPosts);
  const addPostToSearchDetail = useNewAnalysisFormStore((state) => state.addPostToSearchDetail);
  const removePostFromSearchDetail = useNewAnalysisFormStore((state) => state.removePostFromSearchDetail);
  const updateSearchDetail = useNewAnalysisFormStore((state) => state.updateSearchDetail);
  const searchDetails = useNewAnalysisFormStore((state) => state.search_details);

  useEffect(() => {
    setKwMain(searchDetail.kw_main || "");
    setKwSecondary(searchDetail.kw_secondary || []);
  }, [searchDetail.kw_main, searchDetail.kw_secondary]);

  // Separate effect for search_type that only runs when the search_type actually changes
  useEffect(() => {
    setIsManualMode(searchDetail.search_type === 'manual');
  }, [searchDetail.search_type]);

  const handleKwMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKwMain(e.target.value);
    updateKeywords(e.target.value, kwSecondary);
  };

  const handleKwSecondaryChange = (index: number, value: string) => {
    const newSecondary = [...kwSecondary];
    newSecondary[index] = value;
    setKwSecondary(newSecondary);
    updateKeywords(kwMain, newSecondary);
  };

  const handleRemoveSecondaryKeyword = (index: number) => {
    const updatedSecondary = [...kwSecondary];
    updatedSecondary[index] = "";
    setKwSecondary(updatedSecondary);
    updateKeywords(kwMain, updatedSecondary);
  };

  const handleSubmitToFetchPosts = async () => {
    if (!kwMain.trim()) {
      toast.error("Main keyword cannot be empty.");
      return;
    }
    if (detailIndex === 0 && (!kwSecondary[0] || !kwSecondary[0].trim())) {
      toast.error("The first secondary keyword is mandatory for the main entity.");
      return;
    }

    setIsLoading(true);
    clearCurrentActiveFetchedPosts();
    clearSelectedPostsForActiveDetail();

    let allFetchedData: NetworkScrap[] = [];
    const processedUrls = new Set<string>();

    const secondaryKws = kwSecondary.filter(kw => kw && kw.trim() !== "");
    const keywordsToFetch = secondaryKws.length > 0
      ? secondaryKws.map(skw => `${kwMain.trim()} ${skw.trim()}`)
      : [kwMain.trim()];

    try {
      // Fetch all keywords in parallel
      const results = await Promise.all(
        keywordsToFetch.map(async (keyword) => {
          toast.info(`Fetching posts for keyword: "${keyword}"...`);
          try {
            return await fetchNetworkScrap(keyword.trim());
          } catch (err) {
            toast.error(`Failed to fetch posts for "${keyword}".`);
            return [];
          }
        })
      );
      results.flat().forEach((post: NetworkScrap) => {
        if (!processedUrls.has(post.url)) {
          allFetchedData.push(post);
          processedUrls.add(post.url);
        }
      });
      setCurrentActiveFetchedPosts(allFetchedData);
      if (allFetchedData.length === 0) {
        toast.info("No posts found for the given keywords.");
      } else {
        toast.success(`Fetched ${allFetchedData.length} unique posts in total.`);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("An error occurred while fetching posts. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = (manual: boolean) => {
    setIsManualMode(manual);
    updateSearchDetail(detailIndex, { search_type: manual ? 'manual' : 'advanced' });
  };

  // Detect social network from URL
  const detectSocialNetwork = (url: string): string => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      if (domain.includes('facebook.com') || domain.includes('fb.com')) return 'facebook';
      if (domain.includes('instagram.com')) return 'instagram';
      if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
      if (domain.includes('linkedin.com')) return 'linkedin';
      if (domain.includes('tiktok.com')) return 'tiktok';
      if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube';
      if (domain.includes('reddit.com')) return 'reddit';
      return 'other';
    } catch {
      return 'other';
    }
  };

  const createManualPost = (url: string, desc?: string): NetworkScrap => {
    const trimmedDesc = desc?.trim() || '';
    return {
      url: url.trim(),
      title: desc?.trim() || '',
      social_network: detectSocialNetwork(url.trim()),
      description: desc?.trim() || '',
      thumbnail: '',
      keyword: trimmedDesc || '',
      ogData: {
        status: 'success',
        data: {
          title: desc?.trim() || 'Manual Entry',
          description: desc?.trim() || 'Manually added post',
        }
      }
    };
  };

  const handleAddSinglePost = () => {
    if (!singleUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(singleUrl.trim());
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    const currentDetail = searchDetails[detailIndex];
    const selectedPosts = currentDetail?.posts_to_analyze || [];

    // Check if URL already exists
    const existingPost = selectedPosts.find(post => post.url === singleUrl.trim());
    if (existingPost) {
      toast.error("This URL has already been added");
      return;
    }

    const manualPost = createManualPost(singleUrl, description);
    addPostToSearchDetail(detailIndex, manualPost);

    // Clear the form
    setSingleUrl('');
    setDescription('');

    toast.success("Post added successfully");
  };

  const handleBulkUpload = () => {
    if (!bulkUrls.trim()) {
      toast.error("Please enter at least one URL");
      return;
    }

    const currentDetail = searchDetails[detailIndex];
    const selectedPosts = currentDetail?.posts_to_analyze || [];

    const urls = bulkUrls.split('\n').map(url => url.trim()).filter(url => url);
    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    urls.forEach(url => {
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        errorCount++;
        return;
      }

      // Check if URL already exists
      const existingPost = selectedPosts.find(post => post.url === url);
      if (existingPost) {
        skippedCount++;
        return;
      }

      const manualPost = createManualPost(url);
      addPostToSearchDetail(detailIndex, manualPost);
      addedCount++;
    });

    setBulkUrls('');

    // Show summary toast
    let message = `Added ${addedCount} posts`;
    if (skippedCount > 0) message += `, skipped ${skippedCount} duplicates`;
    if (errorCount > 0) message += `, ${errorCount} invalid URLs`;

    if (addedCount > 0) {
      toast.success(message);
    } else if (skippedCount > 0 || errorCount > 0) {
      toast.warning(message);
    }
  };

  const handleRemovePost = (postUrl: string) => {
    removePostFromSearchDetail(detailIndex, postUrl);
    toast.success("Post removed");
  };

  const getKwMainLabel = () => {
    if (!category) return "Main Keyword";
    const isCompetitor = detailIndex > 0;
    if (category === "Company") return isCompetitor ? "Competitor Name*" : "Company Name*";
    if (category === "Political Campaign") return isCompetitor ? "Opposition Name*" : "Candidate or Party Name*";
    if (category === "Content Creator") return isCompetitor ? "Other Creator Name*" : "Creator Name*";
    return "Main Keyword*";
  };

  const numSecondaryKeywords = detailIndex === 0 ? 4 : 3;
  const currentDetail = searchDetails[detailIndex];
  const selectedPosts = currentDetail?.posts_to_analyze || [];

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">
                {isManualMode ? "Manual Post Input" : "Automated Search"}
              </Label>
              <div className="text-sm text-muted-foreground">
                {isManualMode
                  ? "Add social media URLs manually"
                  : "Search for posts using keywords"
                }
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor={`mode-toggle-${detailIndex}`} className="text-sm">
                {isManualMode ? "Manual" : "Auto"}
              </Label>
              <Switch
                id={`mode-toggle-${detailIndex}`}
                checked={isManualMode}
                onCheckedChange={handleModeToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Input */}
      <div>
        <Label htmlFor={`kw-main-${detailIndex}`}>{getKwMainLabel()}</Label>
        <Input
          id={`kw-main-${detailIndex}`}
          value={kwMain}
          onChange={handleKwMainChange}
          placeholder={getKwMainLabel().replace('*', '')}
        />
      </div>

      {/* Secondary Keywords (only in automated mode) */}
      {!isManualMode && Array.from({ length: numSecondaryKeywords }).map((_, index) => (
        <div key={index}>
          <Label htmlFor={`kw-secondary-${detailIndex}-${index}`}>
            {`Keyword ${index + 1}${detailIndex === 0 && index === 0 ? '*' : ''}`}
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`kw-secondary-${detailIndex}-${index}`}
              value={kwSecondary[index] || ""}
              onChange={(e) => handleKwSecondaryChange(index, e.target.value)}
              placeholder={`Enter keyword ${index + 1}`}
            />
            {!(detailIndex === 0 && index === 0) && kwSecondary[index] && (
              <Button variant="ghost" size="icon" onClick={() => handleRemoveSecondaryKeyword(index)} title="Clear keyword">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Manual Input Mode */}
      {isManualMode && (
        <>
          {/* Single URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Single Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`single-url-${detailIndex}`}>Social Media URL</Label>
                <Input
                  id={`single-url-${detailIndex}`}
                  placeholder="https://www.facebook.com/post/..."
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSinglePost();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`single-description-${detailIndex}`}>Description (Optional)</Label>
                <Textarea
                  id={`single-description-${detailIndex}`}
                  placeholder="Brief description of the post..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <Button onClick={handleAddSinglePost} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Post
              </Button>
            </CardContent>
          </Card>

          {/* Bulk URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`bulk-urls-${detailIndex}`}>Social Media URLs (one per line)</Label>
                <Textarea
                  id={`bulk-urls-${detailIndex}`}
                  className="min-h-[120px]"
                  placeholder="https://facebook.com/video/123&#10;https://instagram.com/p/abc&#10;https://tiktok.com/@user/video/xyz"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                />
              </div>
              <Button onClick={handleBulkUpload} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload URLs
              </Button>
            </CardContent>
          </Card>

          {/* Selected Posts Display */}
          {selectedPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Added Posts ({selectedPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedPosts.map((post, index) => (
                    <div key={post.url} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {post.title ||
                            (post.ogData?.status === 'success' ? post.ogData.data.title : undefined) ||
                            'Manual Entry'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {post.url}
                        </div>
                        {(post.description ||
                          (post.ogData?.status === 'success' ? post.ogData.data.description : undefined)) && (
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {post.description ||
                                (post.ogData?.status === 'success' ? post.ogData.data.description : undefined)}
                            </div>
                          )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Platform: {post.social_network}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePost(post.url)}
                        className="flex-shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        {!isManualMode ? (
          <Button onClick={handleSubmitToFetchPosts} className="flex-1">Fetch Posts</Button>
        ) : (
          <div className="flex-1" />
        )}
        <Button
          onClick={() => {
            clearSelectedPostsForActiveDetail();
            toast.info("Cleared selected posts for this configuration.");
          }}
          variant="outline"
          className="flex-1"
        >
          Clear Selected Posts
        </Button>
      </div>
    </div>
  );
}

export default KeywordInputForm; 
