import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.ts";
import { HttpError } from "../../lib/errors.ts";
import { Prisma } from "../../generated/prisma/client.ts";
import type { RegisterInput } from "./auth.schemas.ts";

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError(409, "Email is already registered");
    }
    throw error;
  }
}
