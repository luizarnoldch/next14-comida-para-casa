import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import React, { useState } from 'react'
import { useNewAnalysisFormStore } from '@/store/newAnalysisFormStore'
import { NetworkScrap } from '@/types/network'

interface ManualSearchProps {
  detailIndex: number;
}

const ManualSearch: React.FC<ManualSearchProps> = ({ detailIndex }) => {
  const [bulkUrls, setBulkUrls] = useState('');
  const [singleUrl, setSingleUrl] = useState('');
  const [description, setDescription] = useState('');

  const addPostToSearchDetail = useNewAnalysisFormStore((state) => state.addPostToSearchDetail);
  const removePostFromSearchDetail = useNewAnalysisFormStore((state) => state.removePostFromSearchDetail);
  const searchDetails = useNewAnalysisFormStore((state) => state.search_details);
  const updateSearchDetail = useNewAnalysisFormStore((state) => state.updateSearchDetail);

  const currentDetail = searchDetails[detailIndex];
  const selectedPosts = currentDetail?.posts_to_analyze || [];

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
      title: trimmedDesc || 'Manual Entry',      // always a string
      social_network: detectSocialNetwork(url.trim()),
      description: trimmedDesc || 'Manually added post',  // always a string
      thumbnail: '', // empty string instead of undefined
      keyword: trimmedDesc || '',
      ogData: {
        status: 'success',
        data: {
          title: trimmedDesc || 'Manual Entry',
          description: trimmedDesc || 'Manually added post',
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

    // Set search_type to manual when posts are added manually
    updateSearchDetail(detailIndex, { search_type: 'manual' });

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

  return (
    <div className="space-y-4">
      {/* Single URL Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Single Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="single-url">Social Media URL</Label>
            <Input
              id="single-url"
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
            <Label htmlFor="single-description">Description (Optional)</Label>
            <Textarea
              id="single-description"
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
            <Label htmlFor="bulk-urls">Social Media URLs (one per line)</Label>
            <Textarea
              id="bulk-urls"
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
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
                    {(post.description || (post.ogData?.status === 'success' && post.ogData.data.description)) && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.description || (post.ogData?.status === 'success' && post.ogData.data.description)}
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
    </div>
  )
}

export default ManualSearch
