import { FetchedPage } from "./types";

export async function fetchPage(rawUrl: string): Promise<FetchedPage> {
  const url = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  const start = Date.now();

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ShipSafeBot/1.0; +https://shipsafe.in/bot)",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(10000),
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
