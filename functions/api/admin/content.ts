import { mergePortfolioContent } from "../../../src/lib/portfolioContent";

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

function isAccessRequest(request: Request) {
  // Access typically injects one or both headers:
  // - Cf-Access-Jwt-Assertion
  // - Cf-Access-Authenticated-User-Email
  return (
    request.headers.has("Cf-Access-Jwt-Assertion") ||
    request.headers.has("Cf-Access-Authenticated-User-Email")
  );
}

export const onRequestGet = async (ctx: any) => {
  const { env, request } = ctx;

  if (!isAccessRequest(request)) {
    return new Response("Unauthorized (Cloudflare Access required)", { status: 401 });
  }

  const raw = await env.CONTENT_KV.get(KEY);
  if (!raw) return json(mergePortfolioContent({}));

  try {
    return json(mergePortfolioContent(JSON.parse(raw)));
  } catch {
    return json(mergePortfolioContent({}));
  }
};

export const onRequestPut = async (ctx: any) => {
  const { env, request } = ctx;

  if (!isAccessRequest(request)) {
    return new Response("Unauthorized (Cloudflare Access required)", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const merged = mergePortfolioContent(body as any);

  await env.CONTENT_KV.put(KEY, JSON.stringify(merged, null, 2));

  return json({ ok: true });
};
