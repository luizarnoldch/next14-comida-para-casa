import { NextRequest, NextResponse } from 'next/server'
import { decode } from 'html-entities'

interface OpenGraphData {
  title?: string
  description?: string
  image?: string
  video?: string
  siteName?: string
  url?: string
}

/**
 * Extract Open Graph meta tags from HTML content and decode HTML entities.
 */
function extractOpenGraphData(html: string): OpenGraphData {
  const ogData: OpenGraphData = {}
  
  const ogRegexes = {
    title: /<meta\s+(?:property|name)="(?:og:title|twitter:title)"\s+content=['"]([^'"]*)['"][^>]*>/i,
    description: /<meta\s+(?:property|name)="(?:og:description|twitter:description)"\s+content=['"]([^'"]*)['"][^>]*>/i,
    image: /<meta\s+(?:property|name)="(?:og:image|twitter:image)"\s+content=['"]([^'"]*)['"][^>]*>/i,
    video: /<meta\s+(?:property|name)="og:video"\s+content=['"]([^'"]*)['"][^>]*>/i,
    siteName: /<meta\s+(?:property|name)="og:site_name"\s+content=['"]([^'"]*)['"][^>]*>/i,
    url: /<meta\s+(?:property|name)="og:url"\s+content=['"]([^'"]*)['"][^>]*>/i,
  }

  // Function to find and decode match
  const findAndDecode = (regex: RegExp): string | undefined => {
    const match = html.match(regex)
    return match && match[1] ? decode(match[1].trim()) : undefined
  }

  ogData.title = findAndDecode(ogRegexes.title)
  ogData.description = findAndDecode(ogRegexes.description)
  ogData.image = findAndDecode(ogRegexes.image)
  ogData.video = findAndDecode(ogRegexes.video)
  ogData.siteName = findAndDecode(ogRegexes.siteName)
  ogData.url = findAndDecode(ogRegexes.url)

  // Fallback for title if og:title not found but page <title> exists
  if (!ogData.title) {
    const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i)
    if (titleTagMatch && titleTagMatch[1]) {
      ogData.title = decode(titleTagMatch[1].trim())
    }
  }
  
  return ogData
}

/**
 * Get user agent string for different platforms
 */
function getUserAgent(url: string): string {
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
  }
  if (url.includes('instagram.com')) {
    return 'Mozilla/5.0 (Linux; Android 9; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36 Instagram 118.0.0.21.119 Android (28/9; 480dpi; 1080x2137; samsung; SM-G975F; beyond2lte; exynos9820; en_US_UTC)'
  }
  if (url.includes('tiktok.com')) {
    return 'WhatsApp/2.23.24.76 A' // Use WhatsApp user agent for TikTok
  }
  
  return 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' // A common bot user agent
}

/**
 * Enhanced TikTok scraping with multiple strategies
 */
async function scrapeTikTokWithStrategies(url: string): Promise<string | null> {
  const strategies = [
    {
      name: 'WhatsApp',
      userAgent: 'WhatsApp/2.23.24.76 A',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      } as Record<string, string>
    },
    {
      name: 'Telegram',
      userAgent: 'TelegramBot (like TwitterBot)',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      } as Record<string, string>
    },
    {
      name: 'Discord',
      userAgent: 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      } as Record<string, string>
    }
  ]

  for (const strategy of strategies) {
    try {
      console.log(`[OG Scraper] Trying TikTok strategy: ${strategy.name}`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': strategy.userAgent,
          ...strategy.headers
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow'
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Check if we got meaningful content (not just the generic page)
        if (html.includes('og:title') && !html.includes('TikTok - Make Your Day')) {
          console.log(`[OG Scraper] TikTok strategy ${strategy.name} successful!`)
          return html
        } else if (html.includes('og:description') || html.includes('twitter:description')) {
          console.log(`[OG Scraper] TikTok strategy ${strategy.name} got some data`)
          return html
        }
      }
    } catch (error) {
      console.warn(`[OG Scraper] TikTok strategy ${strategy.name} failed:`, error)
    }
  }
  
  return null
}

/**
 * Enhanced Instagram scraping with multiple strategies
 */
async function scrapeInstagramWithStrategies(url: string): Promise<string | null> {
  const strategies = [
    {
      name: 'Facebook Bot',
      userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      } as Record<string, string>
    },
    {
      name: 'WhatsApp',
      userAgent: 'WhatsApp/2.23.24.76 A',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      } as Record<string, string>
    },
    {
      name: 'Twitter Bot',
      userAgent: 'Twitterbot/1.0',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      } as Record<string, string>
    },
    {
      name: 'Instagram Mobile',
      userAgent: 'Mozilla/5.0 (Linux; Android 9; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36 Instagram 118.0.0.21.119 Android (28/9; 480dpi; 1080x2137; samsung; SM-G975F; beyond2lte; exynos9820; en_US_UTC)',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1'
      } as Record<string, string>
    }
  ]

  for (const strategy of strategies) {
    try {
      console.log(`[OG Scraper] Trying Instagram strategy: ${strategy.name}`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': strategy.userAgent,
          ...strategy.headers
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow'
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Check if we got meaningful content
        if (html.includes('og:title') && !html.includes('Instagram') && html.includes('og:description')) {
          console.log(`[OG Scraper] Instagram strategy ${strategy.name} successful!`)
          return html
        } else if (html.includes('og:image') || html.includes('twitter:image')) {
          console.log(`[OG Scraper] Instagram strategy ${strategy.name} got some data`)
          return html
        }
      }
    } catch (error) {
      console.warn(`[OG Scraper] Instagram strategy ${strategy.name} failed:`, error)
    }
  }
  
  return null
}

export async function GET(request: NextRequest) {
  const requestUrl = request.url
  console.log(`[OG Scraper] Received GET request for: ${requestUrl}`)
  try {
    const { searchParams } = new URL(requestUrl)
    const urlToScrape = searchParams.get('url')
    
    if (!urlToScrape) {
      console.warn('[OG Scraper] URL parameter is missing')
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }
    console.log(`[OG Scraper] Scraping URL: ${urlToScrape}`)
    
    // Validate URL
    try {
      new URL(urlToScrape)
    } catch {
      console.warn(`[OG Scraper] Invalid URL provided: ${urlToScrape}`)
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }
    
    const supportedDomains = ['facebook.com', 'instagram.com', 'tiktok.com', 'fb.watch']
    const urlDomain = new URL(urlToScrape).hostname.toLowerCase()
    const isSupported = supportedDomains.some(domain => 
      urlDomain.includes(domain) || urlDomain.endsWith(domain)
    )
    
    if (!isSupported) {
      console.warn(`[OG Scraper] Unsupported domain: ${urlDomain} for URL: ${urlToScrape}`)
      // Still attempt to scrape, but be aware it might not work well
      // return NextResponse.json(
      //   { error: 'Unsupported domain' },
      //   { status: 400 }
      // )
    }
    
    const userAgent = getUserAgent(urlToScrape)
    console.log(`[OG Scraper] Using User-Agent: ${userAgent}`)

    let html = ''
    
    // Special handling for TikTok URLs
    if (urlToScrape.includes('tiktok.com')) {
      console.log(`[OG Scraper] Using enhanced TikTok scraping strategies...`)
      html = await scrapeTikTokWithStrategies(urlToScrape) || ''
      
      if (!html) {
        console.warn(`[OG Scraper] All TikTok strategies failed, falling back to mock data`)
        const mockData = generateMockOGData(urlToScrape)
        return NextResponse.json(mockData)
      }
    } else if (urlToScrape.includes('instagram.com')) {
      console.log(`[OG Scraper] Using enhanced Instagram scraping strategies...`)
      html = await scrapeInstagramWithStrategies(urlToScrape) || ''
      
      if (!html) {
        console.warn(`[OG Scraper] All Instagram strategies failed, falling back to mock data`)
        const mockData = generateMockOGData(urlToScrape)
        return NextResponse.json(mockData)
      }
    } else {
      // Standard fetch for non-TikTok/Instagram URLs (Facebook, etc.)
      const response = await fetch(urlToScrape, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'DNT': '1', // Do Not Track
          'Upgrade-Insecure-Requests': '1'
        },
        signal: AbortSignal.timeout(15000), // 15 seconds timeout
        redirect: 'follow' // Follow redirects
      })
      
      console.log(`[OG Scraper] Fetch response status for ${urlToScrape}: ${response.status}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[OG Scraper] HTTP error for ${urlToScrape}! Status: ${response.status}, Body: ${errorText.substring(0, 500)}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      html = await response.text()
    }
    
    const ogData = extractOpenGraphData(html)
    console.log(`[OG Scraper] Extracted OG Data for ${urlToScrape}:`, JSON.stringify(ogData, null, 2))
    
    // Enhanced validation - check for meaningful content
    const hasValidTitle = ogData.title && ogData.title.length > 3 && !ogData.title.includes('Just a moment')
    const hasValidImage = ogData.image && ogData.image.startsWith('http')
    
    // Additional image URL validation and cleanup
    if (ogData.image) {
      try {
        // Validate that the image URL is properly formatted
        new URL(ogData.image)
        console.log(`[Enhanced OG Scraper] Valid image URL found: ${ogData.image.substring(0, 100)}...`)
      } catch (error) {
        console.warn(`[Enhanced OG Scraper] Invalid image URL format: ${ogData.image}`)
        ogData.image = undefined
      }
    }
    
    if (!hasValidTitle && !ogData.image) {
      console.warn(`[Enhanced OG Scraper] No substantial OG data found for ${urlToScrape}. Using enhanced mock data.`)
      const mockData = generateEnhancedMockData(urlToScrape)
      return NextResponse.json(mockData)
    }
    
    return NextResponse.json(ogData)
    
  } catch (error: any) {
    const errMessage = error instanceof Error ? error.message : String(error)
    console.error(`[OG Scraper] General error scraping for request ${requestUrl}:`, errMessage)
    console.error(error.stack)

    const urlParamForFallback = new URL(requestUrl).searchParams.get('url')
    if (urlParamForFallback) {
      console.warn(`[OG Scraper] Falling back to mock data for URL due to error: ${urlParamForFallback}`)
      const mockData = generateMockOGData(urlParamForFallback)
      return NextResponse.json(mockData)
    }
    
    return NextResponse.json(
      { error: 'Failed to scrape Open Graph data', details: errMessage },
      { status: 500 }
    )
  }
}

function generateMockOGData(url: string): OpenGraphData {
  const hash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const seed = Math.abs(hash) % 1000
  let platform = 'Social Media'
  let title = 'Video Content'
  let description = 'Social media content'
  let imageUrl = `https://picsum.photos/seed/${seed}/400/225?text=Fallback+Preview`

  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    platform = 'Facebook'
    title = 'Facebook Video'
    description = 'Watch this amazing video on Facebook'
    imageUrl = `https://picsum.photos/seed/${seed}/1200/630?text=Facebook+Video`
  } else if (url.includes('instagram.com')) {
    platform = 'Instagram'
    // Extract post ID for more realistic mock data
    const postMatch = url.match(/\/p\/([a-zA-Z0-9_-]+)/)
    const reelMatch = url.match(/\/reel\/([a-zA-Z0-9_-]+)/)
    if (postMatch) {
      title = `Instagram Post • ${postMatch[1]}`
      description = 'Beautiful moments captured and shared on Instagram'
      // Use square aspect ratio for Instagram posts
      imageUrl = `https://picsum.photos/seed/${seed}/1080/1080?text=Instagram+Post`
    } else if (reelMatch) {
      title = `Instagram Reel • ${reelMatch[1]}`
      description = 'Trending reel content on Instagram'
      // Use vertical aspect ratio for Instagram reels
      imageUrl = `https://picsum.photos/seed/${seed}/1080/1920?text=Instagram+Reel`
    } else {
      title = 'Instagram Content'
      description = 'Discover amazing content on Instagram'
      imageUrl = `https://picsum.photos/seed/${seed}/1080/1080?text=Instagram+Content`
    }
  } else if (url.includes('tiktok.com')) {
    platform = 'TikTok'
    title = 'TikTok Video'
    description = 'Watch this trending video on TikTok'
    // Use vertical aspect ratio for TikTok videos
    imageUrl = `https://picsum.photos/seed/${seed}/1080/1920?text=TikTok+Video`
  }
  
  return {
    title: `${title} - Mock Content (Scraping Failed)`,
    description: `${description}. Real content could not be loaded. URL: ${url}`,
    image: imageUrl,
    siteName: platform,
    url: url
  }
}

function generateEnhancedMockData(url: string): OpenGraphData {
  const hash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const seed = Math.abs(hash) % 1000
  let platform = 'Social Media'
  let title = 'Video Content'
  let description = 'Social media content'
  let imageUrl = `https://picsum.photos/seed/${seed}/400/225?text=${platform}+Preview`

  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    platform = 'Facebook'
    title = 'Facebook Video'
    description = 'Amazing video content shared on Facebook'
    imageUrl = `https://picsum.photos/seed/${seed}/1200/630?text=Facebook+Video`
  } else if (url.includes('instagram.com')) {
    platform = 'Instagram'
    // Extract post ID for more realistic mock data
    const postMatch = url.match(/\/p\/([a-zA-Z0-9_-]+)/)
    const reelMatch = url.match(/\/reel\/([a-zA-Z0-9_-]+)/)
    if (postMatch) {
      title = `Instagram Post • ${postMatch[1]}`
      description = 'Beautiful moments captured and shared on Instagram'
      // Use square aspect ratio for Instagram posts with Instagram-style preview
      imageUrl = `https://picsum.photos/seed/${seed}/1080/1080?text=📸+Instagram+Post`
    } else if (reelMatch) {
      title = `Instagram Reel • ${reelMatch[1]}`
      description = 'Trending reel content on Instagram'
      // Use vertical aspect ratio for Instagram reels
      imageUrl = `https://picsum.photos/seed/${seed}/1080/1920?text=🎬+Instagram+Reel`
    } else {
      title = 'Instagram Content'
      description = 'Discover amazing visual stories on Instagram'
      imageUrl = `https://picsum.photos/seed/${seed}/1080/1080?text=📱+Instagram`
    }
  } else if (url.includes('tiktok.com')) {
    platform = 'TikTok'
    title = 'TikTok Video'
    description = 'Viral video content on TikTok'
    imageUrl = `https://picsum.photos/seed/${seed}/1080/1920?text=🎵+TikTok+Video`
  }
  
  return {
    title: `${title} - Enhanced Mock Content`,
    description: `${description}. This is enhanced fallback content while we work on improving scraping capabilities.`,
    image: imageUrl,
    siteName: platform,
    url: url
  }
} 