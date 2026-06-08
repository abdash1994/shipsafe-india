export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type CheckStatus = "pass" | "fail" | "warn" | "skip";

export interface CheckResult {
  id: string;
  title: string;
  description: string;
  status: CheckStatus;
  severity: Severity;
  detail?: string;
  fixGuide?: string;
  regulation?: string; // e.g. "DPDP Section 5", "RBI PA-O 2025"
  isIndiaSpecific: boolean;
}

export type CategoryId =
  | "india"
  | "security"
  | "legal"
  | "seo"
  | "analytics"
  | "infrastructure"
  | "payments"
  | "github";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
  checks: CheckResult[];
}

export interface ScanResult {
  url: string;
  scannedAt: string;
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  categories: Category[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    passed: number;
    total: number;
  };
  scanDurationMs: number;
}

export interface ScanRequest {
  url: string;
}

export interface FetchedPage {
  url: string;
  html: string;
  headers: Record<string, string>;
  statusCode: number;
  responseTimeMs: number;
  finalUrl: string; // after redirects
}
