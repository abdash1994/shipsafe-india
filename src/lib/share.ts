import { ScanResult } from "./types";

// Compress + base64 encode scan result for URL sharing
// We use a slimmed-down version to keep URL manageable
export function encodeResult(result: ScanResult): string {
  try {
    // Keep only what's needed to display results — drop verbose fixGuide text
    const slim = {
      url: result.url,
      scannedAt: result.scannedAt,
      score: result.score,
      grade: result.grade,
      summary: result.summary,
      scanDurationMs: result.scanDurationMs,
      categories: result.categories.map(cat => ({
        id: cat.id,
        label: cat.label,
        icon: cat.icon,
        description: cat.description,
        checks: cat.checks.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          status: c.status,
          severity: c.severity,
          detail: c.detail,
          fixGuide: c.fixGuide,
          regulation: c.regulation,
          isIndiaSpecific: c.isIndiaSpecific,
        })),
      })),
    };
    const json = JSON.stringify(slim);
    // btoa works in both Node and browser for ASCII-safe content
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeResult(encoded: string): ScanResult | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as ScanResult;
  } catch {
    return null;
  }
}

export function buildShareUrl(result: ScanResult, baseUrl = "https://shipsafe-india.vercel.app"): string {
  const encoded = encodeResult(result);
  if (!encoded) return baseUrl;
  return `${baseUrl}/results?r=${encoded}`;
}
