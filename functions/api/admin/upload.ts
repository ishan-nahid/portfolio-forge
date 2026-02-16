function isAccessRequest(request: Request) {
  return (
    request.headers.has("Cf-Access-Jwt-Assertion") ||
    request.headers.has("Cf-Access-Authenticated-User-Email")
  );
}

function sanitizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 120);
}

export const onRequestPost = async (ctx: any) => {
  const { env, request } = ctx;

  if (!isAccessRequest(request)) {
    return new Response("Unauthorized (Cloudflare Access required)", { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response("Expected multipart/form-data", { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return new Response('Missing "file" field', { status: 400 });
  }

  const folder = String(form.get("folder") ?? "uploads").trim() || "uploads";
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");

  const original = sanitizeName(file.name || "upload");
  const ext = original.includes(".") ? original.split(".").pop() : "";
  const id = crypto.randomUUID();
  const key = `${safeFolder}/${Date.now()}-${id}${ext ? `.${ext}` : ""}`;

  await env.ASSETS_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const base = String(env.R2_PUBLIC_BASE_URL || "").replace(/\/+$/g, "");
  const url = `${base}/${key}`;

  return new Response(JSON.stringify({ key, url }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
