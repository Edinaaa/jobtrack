import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import { registerSchema } from "./auth.schemas.js";
import { register } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);