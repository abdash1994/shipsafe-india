import { describe, expect, it } from "vitest";

import { founderJourneys } from "./site-journeys";
import { startupGuidePhases } from "./startup-guide";

describe("founderJourneys", () => {
  it("defines the two top-level founder paths for the landing page", () => {
    expect(founderJourneys).toHaveLength(2);

    expect(founderJourneys).toEqual([
      expect.objectContaining({
        id: "startup",
        href: "/startup",
        cta: "Start the checklist",
      }),
      expect.objectContaining({
        id: "scan",
        href: "/scan",
        cta: "Scan now",
      }),
    ]);
  });

  it("keeps the copy scoped to startup guidance and ship readiness", () => {
    expect(founderJourneys[0]?.eyebrow).toContain("starting");
    expect(founderJourneys[1]?.eyebrow).toContain("built");
    expect(founderJourneys[1]?.title).toContain("Ship");
  });
});

describe("startupGuidePhases", () => {
  it("defines the five launch-readiness phases in order", () => {
    expect(startupGuidePhases.map((phase) => phase.id)).toEqual([
      "foundation",
      "money-trust",
      "compliance-risk",
      "launch-readiness",
      "pre-ship-check",
    ]);
  });

  it("gives every checklist item the fields needed by the guide UI", () => {
    for (const phase of startupGuidePhases) {
      expect(phase.items.length).toBeGreaterThan(0);

      for (const item of phase.items) {
        expect(item.title).toBeTruthy();
        expect(item.what).toBeTruthy();
        expect(item.when).toBeTruthy();
        expect(item.status).toMatch(/mandatory|recommended|later/);
        expect(item.commonMistake).toBeTruthy();
      }
    }
  });

  it("ends with a pre-ship phase that routes founders into the scanner", () => {
    const lastPhase = startupGuidePhases[startupGuidePhases.length - 1];

    expect(lastPhase?.cta).toEqual(
      expect.objectContaining({
        href: "/scan",
        label: "Run the ship readiness scan",
      }),
    );
  });
});
