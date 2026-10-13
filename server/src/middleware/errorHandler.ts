import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/errors.js";

// Runs when no route matched the request
export const notFoundHandler: RequestHandler = (req) => {
  throw new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`);
};

// Runs when anything before it threw an error
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // 1. Request body failed Zod validation
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  // 2. Errors we threw on purpose (404, 409, 401, ...)
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { message: err.message } });
    return;
  }

  // 3. Client sent broken JSON (thrown by express.json())
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: { message: "Invalid JSON in request body" } });
    return;
  }

  // 4. Anything else is a bug or an outage: log it, but don't leak details
  console.error(err);
  res.status(500).json({ error: { message: "Something went wrong" } });
};