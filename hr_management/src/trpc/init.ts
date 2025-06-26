
// import { authOptions } from '@/lib/auth/auth';
// import { initTRPC, TRPCError } from '@trpc/server';
// import { getServerSession } from 'next-auth';
// import { Session } from 'next-auth';
// import { cache } from 'react';
// import superjson from 'superjson';
// // import { authOptions, authOptionsType } from "@/app/api/auth/[...nextauth]/route";

// export type AppContext = {
//   session: Session | null;
// };

// const t = initTRPC.context<AppContext>().create({
//   transformer: superjson,
//   errorFormatter({ shape, error }) {
//     return {
//       ...shape,
//       data: {
//         ...shape.data,
//         zodError:
//           error.code === "BAD_REQUEST" && error.cause instanceof Error
//             ? JSON.parse(error.cause.message)
//             : null,
//       },
//     };
//   },
// });

// export const createTRPCContext = cache(
//   async (): Promise<AppContext> => {
//     const session = await getServerSession(authOptions );
//     return { session };
//   }
// );

// export const createTRPCRouter = t.router;
// export const publicProcedure = t.procedure;
// export const createCallerFactory = t.createCallerFactory;
// export const baseProcedure = t.procedure;

// export const protectedProcedure = t.procedure.use(async (opts) => {
//   // Access the session from the tRPC context.
//   const session = opts.ctx.session;

//   if (!session || !session.user || !session.user.id) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Not authenticated or user ID missing.",
//     });
//   }


//   return opts.next({
//     ctx: {
//       ...opts.ctx, // Pass along the existing context
//       session: session.user.id,     // Re-assign the session if necessary
//     },
//   });
// });




import { authOptions } from '@/lib/auth/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession, Session } from 'next-auth';
import { cache } from 'react';
import SuperJSON from 'superjson';

export type AppContext = {
  session: Session | null;
};
export const createTRPCContext = cache(async (): Promise<AppContext> => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
    const session = await getServerSession(authOptions);
    return { session };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<AppContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: SuperJSON,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  // Access the session from the tRPC context.
  const session = opts.ctx.session;

  if (!session || !session.user || !session.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated or user ID missing.",
    });
  }


  return opts.next({
    ctx: {
      ...opts.ctx, // Pass along the existing context
      session: session.user.id,     // Re-assign the session if necessary
    },
  })
  });