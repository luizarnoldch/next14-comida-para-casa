import { NetworkScrap } from "@/types/network";

const SCRAPPER_API_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL || "https://scraper.deepfeel.xyz";

export const fetchNetworkScrap = async (keyword: string): Promise<NetworkScrap[]> => {
  const keywordValue = keyword.trim();
  if (!keywordValue) {
    return [];
  }

  console.log("Searching for keyword:", keywordValue);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000); // 40 second timeout

    const response = await fetch(`${SCRAPPER_API_URL}/search?q=${encodeURIComponent(keywordValue)}`, {
      signal: controller.signal,
      // next: { revalidate: 0 }, // Not applicable for client-side fetch
      // cache: 'no-store', // Not applicable for client-side fetch, use headers
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error("Failed to fetch from scrapper API:", response.statusText);
      // Throw an error to be caught by React Query
      throw new Error(`Failed to fetch from scrapper API: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.status !== "success" || !Array.isArray(result.data)) {
      console.error("Invalid response format from scrapper API");
      // Throw an error to be caught by React Query
      throw new Error("Invalid response format from scrapper API");
    }

    // Transform the response to match our NetworkScrap type
    const transformedResults: NetworkScrap[] = result.data.map((item: any) => ({
      keyword: item.keywords,
      social_network: item.social_network,
      url: item.url
    }));

    console.log("Scrap results for", keywordValue, transformedResults);
    return transformedResults;
  } catch (error) {
    console.error("Error fetching from scrapper API:", error);
    // Re-throw the error to be caught by React Query
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching from scrapper API");
  }
}; 