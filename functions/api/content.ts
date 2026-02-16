import { DEFAULT_PORTFOLIO_DATA, mergePortfolioContent } from "../../src/lib/portfolioContent";

const KEY = "content";

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers ?? {}),
    },
  });
}

export const onRequestGet = async (ctx: any) => {
  const { env } = ctx;

  try {
    const raw = await env.CONTENT_KV.get(KEY);
    if (!raw) return json(DEFAULT_PORTFOLIO_DATA);

    const parsed = JSON.parse(raw);
    return json(mergePortfolioContent(parsed));
  } catch {
    return json(DEFAULT_PORTFOLIO_DATA);
  }
};
