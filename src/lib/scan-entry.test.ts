import { describe, expect, it } from "vitest";

import {
  getLegacyScanRedirect,
  getScanInputMode,
  getScanRequestUrl,
} from "./scan-entry";

describe("scan entry routing", () => {
  it("preserves legacy home-page scanner deep links by redirecting them to /scan", () => {
    expect(getLegacyScanRedirect("https%3A%2F%2Fexample.com")).toBe(
      "/scan?url=https%3A%2F%2Fexample.com",
    );
  });

  it("normalizes bookmarklet URLs into a decoded scan request", () => {
    expect(getScanRequestUrl("https%3A%2F%2Fexample.com")).toBe(
      "https://example.com",
    );
    expect(getScanRequestUrl(null)).toBe("");
  });

  it("derives the correct input mode from the requested scan URL", () => {
    expect(getScanInputMode("https://github.com/acme/repo")).toBe("github");
    expect(getScanInputMode("https://acme.in")).toBe("url");
  });
});
