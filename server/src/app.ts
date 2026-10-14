
import { authRouter } from "./modules/auth/auth.routes.js";
import express from "express";

import { z } from "zod";
import { prisma } from "./lib/prisma.js";
import { validateBody } from "./middleware/validate.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/api/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", database: "connected" });
    } catch {
      res.status(503).json({ status: "error", database: "disconnected" });
    }
  });
  app.use("/api/auth", authRouter);
  // These two must come LAST
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}