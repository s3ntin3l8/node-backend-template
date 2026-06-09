import Fastify from "fastify";
import sensible from "@fastify/sensible";
import { envPlugin } from "./plugins/env.js";
import { loggingPlugin } from "./plugins/logging.js";
import { rootRoute } from "./routes/root.js";
import { healthRoute } from "./routes/health.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
    },
  });

  await app.register(envPlugin);
  await app.register(loggingPlugin);
  await app.register(sensible);

  await app.register(rootRoute);
  await app.register(healthRoute);

  return app;
}