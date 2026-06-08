import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { founderJourneys } from "@/lib/site-journeys";
import { startupGuidePhases } from "@/lib/startup-guide";
import { FounderJourneyCards } from "./founder-journey-cards";
import { StartupGuideView } from "./startup-guide-view";

describe("FounderJourneyCards", () => {
  it("renders the two route cards for the split landing page", () => {
    const html = renderToStaticMarkup(
      <FounderJourneyCards journeys={founderJourneys} />,
    );

    expect(html).toContain("Start the checklist");
    expect(html).toContain("Scan now");
    expect(html).toContain('href="/startup"');
    expect(html).toContain('href="/scan"');
  });
});

describe("StartupGuideView", () => {
  it("renders each launch phase and the final scan CTA", () => {
    const html = renderToStaticMarkup(
      <StartupGuideView phases={startupGuidePhases} />,
    );

    expect(html).toContain("Phase 1: Foundation");
    expect(html).toContain("Phase 5: Pre-Ship Check");
    expect(html).toContain("Run the ship readiness scan");
    expect(html).toContain('href="/scan"');
  });
});
