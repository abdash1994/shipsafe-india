export function getScanRequestUrl(urlParam?: string | null) {
  return urlParam ? decodeURIComponent(urlParam) : "";
}

export function getLegacyScanRedirect(urlParam?: string | null) {
  if (!urlParam) {
    return null;
  }

  return `/scan?url=${encodeURIComponent(getScanRequestUrl(urlParam))}`;
}

export function getScanInputMode(url: string): "url" | "github" {
  return url.includes("github.com") ? "github" : "url";
}
