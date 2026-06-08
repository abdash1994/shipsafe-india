import type { Metadata } from "next";

import { ScanExperience } from "@/components/scan-experience";
import { getScanRequestUrl } from "@/lib/scan-entry";

export const metadata: Metadata = {
  title: "ShipSafe India — Scan Before You Ship",
  description:
    "Run ShipSafe's India-first readiness scan for DPDP, RBI, CERT-In, legal, security, SEO, and monitoring gaps before launch.",
};

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const params = await searchParams;
  const initialUrl = getScanRequestUrl(params.url);

  return <ScanExperience key={initialUrl || "scan"} initialUrl={initialUrl} />;
}
