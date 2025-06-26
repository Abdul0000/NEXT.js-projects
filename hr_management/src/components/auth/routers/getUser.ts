// import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { db } from "@/db";
import { users } from "@/db/auth-schema";
// import { users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    // Session se user ID nikal kar user ki details fetch karein
    const userId = ctx.session;
    // console.log("User ID from session:", ctx);
    if (!userId) {
      throw new Error("User ID not found in session.");
    }
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new Error("User not found.");
    }

    // Password ya salt jaisi sensitive information ko client ko na bhejein
    const { hashedPassword, salt, ...userPublicData } = user;
    return userPublicData;
  }),
});