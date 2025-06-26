
import { db } from "@/db";
import { users } from "@/db/auth-schema";
import { newEmployees } from "@/db/schema";
import { createTRPCContext } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";
const f = createUploadthing();


export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({
      employee_id: z.string().uuid().optional(),
    })).middleware(async ({ input }) => {
      // const {userId: clerkUserId} = await auth();
      const ctx = await createTRPCContext();
      const userId = ctx && ctx?.session?.user.id;
      if (!userId || !users.id) throw new UploadThingError("Unauthorized");
      const [user]  = await db.select().from(users).where(eq(users.id, userId));
      if (!user ) throw new UploadThingError("Unauthorized");
      const {employee_id} = input
      if(!employee_id) throw new UploadThingError("Unauthorized");
      const [employee] = await db.select({imageKey: newEmployees.imageKey}).from(newEmployees).where(and(eq(newEmployees.id, employee_id), eq(newEmployees.userId, user.id)))
      if (!employee) throw new UploadThingError("Employee not found");
      const utApi = new UTApi()
      if(employee.imageKey){
        await utApi.deleteFiles(employee.imageKey)
        await db.update(newEmployees).set({
          imageKey: null,
          image_url: null,
        }).where(and(eq(newEmployees.id, employee_id), eq(newEmployees.userId, user.id)))
      }
      
      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const {employee_id} = metadata
      if(!employee_id) throw new UploadThingError("Unauthorized");
      await db.update(newEmployees).set({
        image_url: file.ufsUrl,
        imageKey: file.key,
      }).where(and(eq(newEmployees.id, employee_id), eq(newEmployees.userId, metadata.user.id))).returning();
      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
