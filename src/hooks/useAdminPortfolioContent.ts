import { useQuery } from "@tanstack/react-query";
import { mergePortfolioContent, type PortfolioContent } from "@/lib/portfolioContent";

async function fetchAdminContent(): Promise<PortfolioContent> {
  const res = await fetch("/api/admin/content", {
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Admin content request failed (${res.status})`);
  }

  const json = (await res.json()) as Partial<PortfolioContent>;
  return mergePortfolioContent(json);
}

export function useAdminPortfolioContent() {
  return useQuery({
    queryKey: ["adminPortfolioContent"],
    queryFn: fetchAdminContent,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
