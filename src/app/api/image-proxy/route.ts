import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }
    
    // Validate URL
    try {
      new URL(imageUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }
    
    console.log(`[Image Proxy] Fetching image: ${imageUrl}`)
    
    // Fetch the image with appropriate headers
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      signal: AbortSignal.timeout(10000),
    })
    
    if (!response.ok) {
      console.warn(`[Image Proxy] Failed to fetch image: ${response.status}`)
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      )
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      console.warn(`[Image Proxy] Invalid content type: ${contentType}`)
      return NextResponse.json(
        { error: 'URL does not point to an image' },
        { status: 400 }
      )
    }
    
    const imageBuffer = await response.arrayBuffer()
    
    console.log(`[Image Proxy] Successfully proxied image: ${imageUrl.substring(0, 100)}...`)
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error: any) {
    const errMessage = error instanceof Error ? error.message : String(error)
    console.error(`[Image Proxy] Error:`, errMessage)
    
    return NextResponse.json(
      { error: 'Failed to proxy image', details: errMessage },
      { status: 500 }
    )
  }
}