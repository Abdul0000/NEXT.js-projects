import { z } from "zod";
import { db } from "@/db";
import { v4 as uuidv4 } from 'uuid'; // User ID generate karne ke liye
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { hashPassword } from "@/utils/authUtils";
import { users } from "@/db/auth-schema";
import { randomBytes } from "crypto";

export const authRouter = createTRPCRouter({
  register: baseProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters long"),
    }))
    .mutation(async ({ input }) => {
      const salt = randomBytes(16).toString('hex').normalize(); 
      const hashedPassword = await hashPassword(input.password, salt );

      try {
        const newUser = await db.insert(users).values({
          id: uuidv4(), 
          name: input.name,
          email: input.email,
          hashedPassword: hashedPassword,
          salt: salt,
        }).returning(); 

        return { success: true, user: newUser[0] };
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          // error !== null &&
          // "code" in error &&
          // "message" in error &&
          // typeof (error as { code: unknown }).code === "string" &&
          // typeof (error as { message: unknown }).message === "string" &&
          // (error as { code: string }).code === '23505' &&
          (error as { message: string }).message.includes('email_idx')
        ) {
          throw new Error("Email already registered.");
        }
        console.error("Registration error:", error);
        throw new Error("Failed to register user. Please try again.");
      }
    }),
});