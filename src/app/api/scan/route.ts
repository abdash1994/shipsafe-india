import { NextRequest, NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";

export const runtime = "nodejs";
export const maxDuration = 30;

// Simple in-memory rate limiting: max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function getRateLimitHeaders(remaining: number, resetAt: number) {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    rateLimitMap.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetAt: entry.resetAt };
}

// Block private/local IPs from being scanned (SSRF protection)
function isBlockedTarget(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("172.17.") ||
      hostname.startsWith("172.18.") ||
      hostname.startsWith("172.19.") ||
      hostname.startsWith("172.2") ||
      hostname.startsWith("172.30.") ||
      hostname.startsWith("172.31.") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    );
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit check
  const { allowed, remaining, resetAt } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          ...getRateLimitHeaders(0, resetAt),
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // SSRF protection — block scanning internal/private addresses
    if (isBlockedTarget(normalizedUrl)) {
      return NextResponse.json(
        { error: "Scanning private or internal addresses is not allowed." },
        { status: 400 }
      );
    }

    // Only allow http/https schemes
    const scheme = new URL(normalizedUrl).protocol;
    if (scheme !== "http:" && scheme !== "https:") {
      return NextResponse.json(
        { error: "Only http and https URLs are supported." },
        { status: 400 }
      );
    }

    const result = await scanUrl(normalizedUrl);

    return NextResponse.json(result, {
      headers: getRateLimitHeaders(remaining, resetAt),
    });
  } catch (error) {
    console.error("Scan error:", error);
    const raw = error instanceof Error ? error.message : "";

    // Map common fetch errors to friendly messages
    let message = "Scan failed. Please try again.";
    if (raw.includes("fetch failed") || raw.includes("ENOTFOUND") || raw.includes("getaddrinfo")) {
      message = "Could not reach that URL. Check the address and try again.";
    } else if (raw.includes("ECONNREFUSED")) {
      message = "Connection refused. The server may be down or blocking scanners.";
    } else if (raw.includes("timeout") || raw.includes("AbortError")) {
      message = "Scan timed out. The site took too long to respond (>10s).";
    } else if (raw.includes("certificate") || raw.includes("SSL")) {
      message = "SSL certificate error. The site may have an invalid HTTPS certificate.";
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
