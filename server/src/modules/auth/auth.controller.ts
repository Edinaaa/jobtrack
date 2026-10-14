import type { RequestHandler } from "express";
import { registerUser } from "./auth.service.ts";
import type { RegisterInput } from "./auth.schemas.ts";

export const register: RequestHandler = async (req, res) => {
  const user = await registerUser(req.body as RegisterInput);
  res.status(201).json({ user });
};