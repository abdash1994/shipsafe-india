import type { Metadata } from "next";

import { StartupGuidePage } from "@/components/startup-guide-page";

export const metadata: Metadata = {
  title: "ShipSafe India — Startup Launch Guide",
  description:
    "A phased startup setup guide for Indian SaaS and web founders: what to set up, when it matters, and what to scan before launch.",
};

export default function StartupPage() {
  return <StartupGuidePage />;
}
