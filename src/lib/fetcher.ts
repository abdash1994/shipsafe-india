import { FetchedPage } from "./types";

export async function fetchPage(rawUrl: string): Promise<FetchedPage> {
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  const start = Date.now();

  const response = await fetch(url, {
    headers: {
      // Realistic Chrome UA — reduces false Cloudflare blocks vs bot UA
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8,hi;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Upgrade-Insecure-Requests": "1",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });

  const html = await response.text();
  const responseTimeMs = Date.now() - start;

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  return {
    url,
    html,
    headers,
    statusCode: response.status,
    responseTimeMs,
    finalUrl: response.url,
  };
}

export async function fetchResource(
  baseUrl: string,
  path: string
): Promise<{ exists: boolean; content: string; statusCode: number }> {
  try {
    const url = new URL(path, baseUrl).toString();
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ShipSafeBot/1.0)" },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
    const content = res.ok ? await res.text() : "";
    return { exists: res.ok, content, statusCode: res.status };
  } catch {
    return { exists: false, content: "", statusCode: 0 };
  }
}
