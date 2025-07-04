import { useQuery } from "@tanstack/react-query";
import { NetworkScrap } from "@/types/network";
import { fetchNetworkScrap } from "@/services/scraperService";

export const useNetworkScrap = (keyword: string) => {
  return useQuery<NetworkScrap[], Error>({
    queryKey: ["networkScrap", keyword],
    queryFn: () => fetchNetworkScrap(keyword),
    enabled: !!keyword.trim(),
    staleTime: 0,
    gcTime: 0,
  });
};
