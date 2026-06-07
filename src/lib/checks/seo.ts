import { CheckResult, FetchedPage } from "../types";

export function runSEOChecks(
  page: FetchedPage,
  robotsTxt: { exists: boolean; content: string },
  sitemapXml: { exists: boolean }
): CheckResult[] {
  const html = page.html;
  const htmlLower = html.toLowerCase();

  const title = extractMeta(html, "title");
  const description = extractMeta(html, "description");
  const ogTitle = extractMeta(html, "og:title");
  const ogImage = extractMeta(html, "og:image");
  const canonical = html.includes('rel="canonical"') || html.includes("rel='canonical'");
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const viewport = htmlLower.includes('name="viewport"') || htmlLower.includes("name='viewport'");
  const favicon =
    htmlLower.includes("rel=\"icon\"") ||
    htmlLower.includes("rel='icon'") ||
    htmlLower.includes("favicon");

  const robotsBlocking =
    robotsTxt.content.toLowerCase().includes("disallow: /\n") ||
    robotsTxt.content.toLowerCase().includes("disallow: /\r") ||
    robotsTxt.content.toLowerCase() === "user-agent: *\ndisallow: /";

  return [
    {
      id: "robots-txt",
      title: "robots.txt Configured",
      description: "robots.txt controls crawler access to your site",
      status: !robotsTxt.exists ? "fail" : robotsBlocking ? "fail" : "pass",
      severity: "high",
      detail: !robotsTxt.exists
        ? "robots.txt not found at /robots.txt"
        : robotsBlocking
        ? "robots.txt is blocking ALL crawlers (Disallow: /) — often a staging leftover"
        : "robots.txt exists and appears correctly configured",
      fixGuide:
        "Create /robots.txt with `User-agent: *\\nAllow: /\\nDisallow: /admin/\\nDisallow: /api/`. Never launch with Disallow: / — inherited from staging templates.",
      isIndiaSpecific: false,
    },
    {
      id: "sitemap",
      title: "sitemap.xml Exists",
      description: "Sitemap helps Google index your pages faster",
      status: sitemapXml.exists ? "pass" : "warn",
      severity: "medium",
      detail: sitemapXml.exists
        ? "sitemap.xml found"
        : "No sitemap.xml found at /sitemap.xml",
      fixGuide:
        "Generate a sitemap using Next.js built-in sitemap support or a plugin. Submit it to Google Search Console on launch day.",
      isIndiaSpecific: false,
    },
    {
      id: "page-title",
      title: "Page Title",
      description: "Descriptive title tag between 50-60 characters",
      status: !title ? "fail" : title.length < 10 ? "warn" : "pass",
      severity: "high",
      detail: title ? `"${title}" (${title.length} chars)` : "No <title> tag found",
      fixGuide:
        "Add a descriptive <title> tag, 50-60 characters. Format: 'Product Name — Short Benefit'",
      isIndiaSpecific: false,
    },
    {
      id: "meta-description",
      title: "Meta Description",
      description: "Meta description improves click-through from search results",
      status: description ? "pass" : "warn",
      severity: "medium",
      detail: description
        ? `"${description.slice(0, 80)}${description.length > 80 ? "..." : ""}"`
        : "No meta description found",
      fixGuide:
        "Add <meta name='description' content='...'> with 120-160 characters summarizing the page.",
      isIndiaSpecific: false,
    },
    {
      id: "og-tags",
      title: "Open Graph Tags",
      description: "Required for proper link preview on WhatsApp, LinkedIn, Twitter",
      status: ogTitle && ogImage ? "pass" : ogTitle ? "warn" : "fail",
      severity: "medium",
      detail:
        ogTitle && ogImage
          ? "og:title and og:image detected"
          : ogTitle
          ? "og:title found but og:image missing"
          : "No Open Graph tags detected",
      fixGuide:
        "Add og:title, og:description, og:image (1200x630px), og:url. Without these you get a blank rectangle when shared on WhatsApp or LinkedIn.",
      isIndiaSpecific: false,
    },
    {
      id: "h1-tag",
      title: "H1 Heading",
      description: "Exactly one H1 per page — Google uses it to determine topic",
      status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
      severity: "medium",
      detail:
        h1Count === 0
          ? "No H1 tag found — Google cannot determine page topic"
          : h1Count === 1
          ? "Single H1 found"
          : `${h1Count} H1 tags found — should be exactly 1`,
      fixGuide:
        "Every page should have exactly one <h1> tag containing the primary keyword/topic. Vibe-coded apps often ship with all H2s.",
      isIndiaSpecific: false,
    },
    {
      id: "canonical-url",
      title: "Canonical URL",
      description: "Prevents duplicate content indexing penalties",
      status: canonical ? "pass" : "warn",
      severity: "medium",
      detail: canonical
        ? "Canonical link tag found"
        : "No canonical URL tag found",
      fixGuide:
        "Add <link rel='canonical' href='https://yourdomain.com/page-url'> to each page to prevent Google treating /page, /page/, and /page?ref=x as duplicates.",
      isIndiaSpecific: false,
    },
    {
      id: "viewport-meta",
      title: "Viewport Meta Tag",
      description: "Required for mobile responsiveness",
      status: viewport ? "pass" : "fail",
      severity: "high",
      detail: viewport ? "Viewport meta tag found" : "No viewport meta tag found",
      fixGuide:
        "Add <meta name='viewport' content='width=device-width, initial-scale=1'> in your <head>.",
      isIndiaSpecific: false,
    },
    {
      id: "favicon",
      title: "Favicon",
      description: "Browser tab icon — basic trust signal",
      status: favicon ? "pass" : "warn",
      severity: "low",
      detail: favicon ? "Favicon detected" : "No favicon link found",
      fixGuide:
        "Add a 32x32 and 180x180 PNG favicon. Reference with <link rel='icon' href='/favicon.ico'>.",
      isIndiaSpecific: false,
    },
  ];
}

function extractMeta(html: string, key: string): string | null {
  if (key === "title") {
    const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return m ? m[1].trim() : null;
  }
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, "i"),
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, "i"),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1].trim();
  }
  return null;
}
