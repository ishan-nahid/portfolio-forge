import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PORTFOLIO_DATA, mergePortfolioContent, type PortfolioContent } from "@/lib/portfolioContent";

async function fetchPublicContent(): Promise<PortfolioContent> {
  try {
    const res = await fetch("/api/content", {
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      // local dev will often 404 (no functions), so fall back silently
      return DEFAULT_PORTFOLIO_DATA;
    }

    const json = (await res.json()) as Partial<PortfolioContent>;
    return mergePortfolioContent(json);
  } catch {
    return DEFAULT_PORTFOLIO_DATA;
  }
}

export function usePortfolioContent() {
  return useQuery({
    queryKey: ["portfolioContent"],
    queryFn: fetchPublicContent,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    initialData: DEFAULT_PORTFOLIO_DATA,
  });
}
