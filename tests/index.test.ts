import { describe, test, expect } from "bun:test";
describe("agent-token-usage-dashboard", () => {
  test("module loads", async () => { const m = await import("./index"); expect(m).toBeDefined(); });
});
