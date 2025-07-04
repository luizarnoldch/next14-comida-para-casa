export interface MediaMetadata { // Renamed from VideoMetadata
  id: string
  platform: 'facebook' | 'instagram' | 'tiktok' | 'unknown' // Added unknown for more general posts
  thumbnailUrl: string
  embedUrl?: string // Kept for video posts
  title: string
  duration?: string // Kept for video posts
  views?: string
  description?: string
}

/**
 * Extract video ID from Facebook URL (kept for video posts)
 */
function extractFacebookVideoId(url: string): string | null {
  const patterns = [
    /facebook\.com\/watch\/?\?.*v=(\d+)/,
    /facebook\.com\/.*\/videos\/(\d+)/,
    /fb\.watch\/([a-zA-Z0-9]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extract video ID from Instagram URL (kept for video posts)
 */
function extractInstagramVideoId(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
    /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
    /instagram\.com\/tv\/([a-zA-Z0-9_-]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extract video ID from TikTok URL (kept for video posts)
 */
function extractTikTokVideoId(url: string): string | null {
  const patterns = [
    /tiktok\.com\/@[^/]+\/video\/(\d+)/,
    /tiktok\.com\/v\/(\d+)/,
    /vm\.tiktok\.com\/([a-zA-Z0-9]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function shouldUseImageProxy(imageUrl: string): boolean {
  if (!imageUrl || !imageUrl.startsWith('http')) return false
  if (imageUrl.includes('tiktokcdn') || imageUrl.includes('tiktok.com')) return true
  if (imageUrl.includes('cdninstagram') || imageUrl.includes('fbcdn.net')) return true
  return false
}

function getImageUrl(originalUrl: string): string {
  if (shouldUseImageProxy(originalUrl)) {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`
  }
  return originalUrl
}

async function fetchOpenGraphData(url: string): Promise<{
  title?: string
  description?: string
  image?: string
  video?: string // OG data might still contain video for playable posts
  siteName?: string
} | null> {
  try {
    const response = await fetch(`/api/og-scraper?url=${encodeURIComponent(url)}`)
    if (!response.ok) throw new Error('Failed to fetch OG data')
    const data = await response.json()
    return data
  } catch (error) {
    console.warn('Failed to fetch Open Graph data:', error)
    return null
  }
}

function generateFallbackThumbnail(platform: string, keyword: string, mediaId: string): string { // Renamed videoId to mediaId
  const hash = (mediaId + keyword).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const seed = Math.abs(hash) % 1000
  return `https://picsum.photos/seed/${seed}/400/225`
}

function getPlatformThumbnail(platform: string, url: string): string {
  const mediaId = extractMediaId(url, platform) // Renamed from extractVideoId
  
  switch (platform.toLowerCase()) {
    case 'facebook':
    case 'facebook meta':
      return `https://graph.facebook.com/${mediaId}/picture?type=large`
    case 'instagram':
    case 'instagram meta':
      return generateFallbackThumbnail(platform, 'instagram', mediaId || url)
    case 'tiktok':
      return generateFallbackThumbnail(platform, 'tiktok', mediaId || url)
    default:
      return generateFallbackThumbnail(platform, 'media', url) // Changed from 'video' to 'media'
  }
}

function extractMediaId(url: string, platform: string): string | null { // Renamed from extractVideoId
  switch (platform.toLowerCase()) {
    case 'facebook':
    case 'facebook meta':
      return extractFacebookVideoId(url)
    case 'instagram':
    case 'instagram meta':
      return extractInstagramVideoId(url)
    case 'tiktok':
      return extractTikTokVideoId(url)
    default:
      return null
  }
}

function generateMockMediaData(url: string, keyword: string, platform: string): MediaMetadata { // Renamed from generateMockVideoData, returns MediaMetadata
  const hash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const mockViews = Math.abs(hash % 1000000) + 1000
  const mockDuration = `${Math.abs(hash % 5) + 1}:${String(Math.abs(hash % 60)).padStart(2, '0')}`
  
  const platformType = platform.toLowerCase().includes('facebook') ? 'facebook' : 
                      platform.toLowerCase().includes('instagram') ? 'instagram' : 
                      platform.toLowerCase().includes('tiktok') ? 'tiktok' : 'unknown';
  
  const titleTemplates = {
    facebook: [
      `Amazing ${keyword} content!`,
      `${keyword} compilation`,
      `Watch this incredible ${keyword} post`,
    ],
    instagram: [
      `${keyword} reel that broke the internet 🔥`,
      `${keyword} content - must see! ✨`,
      `Viral ${keyword} moment 📱`,
    ],
    tiktok: [
      `${keyword} trend everyone's talking about`,
      `${keyword} challenge gone viral 🎵`,
      `You won't believe this ${keyword} clip`,
    ],
    unknown: [
        `Interesting ${keyword} post`,
        `Check out this ${keyword} content`,
    ]
  }
  
  const templates = titleTemplates[platformType as keyof typeof titleTemplates]
  const title = templates[Math.abs(hash) % templates.length]
  
  return {
    id: url,
    platform: platformType as MediaMetadata['platform'],
    thumbnailUrl: getPlatformThumbnail(platform, url),
    title,
    duration: platformType !== 'unknown' ? mockDuration : undefined, // Duration might not apply to all posts
    views: `${mockViews.toLocaleString()}`,
    description: `${keyword} content from ${platformType}`
  }
}

export async function parseMediaUrlWithOG(url: string, keyword: string, socialNetwork: string): Promise<MediaMetadata> { // Renamed, returns MediaMetadata
  try {
    const ogData = await fetchOpenGraphData(url)
    
    const platformIdentifier = socialNetwork.toLowerCase();
    let platformType: MediaMetadata['platform'] = 'unknown';
    if (platformIdentifier.includes('facebook')) platformType = 'facebook';
    else if (platformIdentifier.includes('instagram')) platformType = 'instagram';
    else if (platformIdentifier.includes('tiktok')) platformType = 'tiktok';

    if (ogData) {
      return {
        id: url,
        platform: platformType,
        thumbnailUrl: getImageUrl(ogData.image || getPlatformThumbnail(socialNetwork, url)),
        title: ogData.title || `Content from ${socialNetwork}`,
        description: ogData.description,
        // For duration and views, these might not be in standard OG, could be platform-specific or from oEmbed if available
        // For now, we will rely on mock or leave undefined if not in OG
        duration: undefined, // Example: extract from ogData.video?.duration if available
        views: undefined,    // Example: extract from custom OG tags if available
        embedUrl: ogData.video || undefined // Assuming ogData.video might be an embeddable video URL
      }
    }
    // Fallback to mock if OG fails or doesn't provide enough data
    console.warn('OG data incomplete or failed, using mock data for:', url);
    return generateMockMediaData(url, keyword, socialNetwork)
  } catch (error) {
    console.error('Error parsing media URL with OG:', error)
    return generateMockMediaData(url, keyword, socialNetwork) // Fallback to mock data on any error
  }
}

export function parseMediaUrl(url: string, keyword: string, socialNetwork: string): MediaMetadata { // Renamed, returns MediaMetadata
  // This function now primarily serves as a fallback or for non-OG metadata
  // It can also be used if an immediate (synchronous) metadata object is needed.
  const platformIdentifier = socialNetwork.toLowerCase();
  let platformType: MediaMetadata['platform'] = 'unknown';
  if (platformIdentifier.includes('facebook')) platformType = 'facebook';
  else if (platformIdentifier.includes('instagram')) platformType = 'instagram';
  else if (platformIdentifier.includes('tiktok')) platformType = 'tiktok';

  const mediaId = extractMediaId(url, socialNetwork);
  const embedUrlValue = mediaId ? getEmbedUrl(socialNetwork, mediaId) : null; // Store in a variable

  return {
    id: mediaId || url,
    platform: platformType,
    thumbnailUrl: getPlatformThumbnail(socialNetwork, url),
    title: `${keyword} post from ${socialNetwork}`,
    description: `Content related to ${keyword} from ${socialNetwork}`,
    duration: undefined,
    views: undefined,
    embedUrl: embedUrlValue === null ? undefined : embedUrlValue // Ensure undefined if null
  };
}

export function getEmbedUrl(platform: string, mediaId: string): string | null { // Renamed from videoId to mediaId
  if (!mediaId) return null;
  switch (platform.toLowerCase()) {
    case 'facebook':
    case 'facebook meta':
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(`https://www.facebook.com/videos/${mediaId}/`)}&show_text=0&width=560`;
    case 'tiktok':
      // TikTok oEmbed might be an option here, or direct iframe if available
      // For simplicity, returning a link to the video page, which often embeds.
      // Proper TikTok embed requires using their oEmbed API: /api/oembed?url=tiktok_url
      return `https://www.tiktok.com/embed/v2/${mediaId}`;
    // Instagram does not have a simple, reliable public embed URL without API auth for general posts/reels.
    // For IGTV, it might be different. This usually requires using their oEmbed product.
    case 'instagram':
    case 'instagram meta':
      return null; // Or a link to the post: `https://www.instagram.com/p/${mediaId}/embed/` (but this has limitations)
    default:
      return null;
  }
} 