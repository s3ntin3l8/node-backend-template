import { describe, it, expect, afterEach } from "vitest";
import { buildApp } from "../../src/app.js";

describe("env plugin", () => {
  afterEach(async () => {
    // Clean up env modifications
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.LOG_LEVEL;
    delete process.env.DATABASE_URL;
    delete process.env.DB_ENCRYPTION_KEY;
  });

  it("loads with default values", async () => {
    const app = await buildApp();
    expect(app.config.NODE_ENV).toBe("development");
    expect(app.config.PORT).toBe(3000);
    expect(app.config.LOG_LEVEL).toBe("info");
    expect(app.config.DATABASE_URL).toBe("file:./data/app.db");
    expect(app.config.DB_ENCRYPTION_KEY).toBe("");
    await app.close();
  });

  it("respects environment variable overrides", async () => {
    process.env.PORT = "4000";
    process.env.LOG_LEVEL = "debug";

    const app = await buildApp();
    expect(app.config.PORT).toBe(4000);
    expect(app.config.LOG_LEVEL).toBe("debug");
    await app.close();
  });
});