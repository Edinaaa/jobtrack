import express from "express";

export function createApp() {
  const app = express();

  // Parse JSON request bodies (e.g. from POST requests) into req.body
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  return app;
}