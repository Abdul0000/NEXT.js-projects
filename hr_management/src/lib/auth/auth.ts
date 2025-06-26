// lib/auth.ts
// import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { users } from "@/db/auth-schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/utils/authUtils";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async redirect({ baseUrl }) {
//       return baseUrl // always redirect to homepage
//     },
//   },
// }

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Look up the user from your database
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));

        if (!user) return null;

        // 2. Verify the user's password with your stored hash and salt
        const validPassword = await verifyPassword(
          credentials.password,
          user.hashedPassword,
          user.salt
        );
        if (!validPassword) return null;

        // 3. Return a minimal public user object with the user ID!
        return {
          id: user.id, // This is crucial
          email: user.email,
          name: user.name, // Optional
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Using a stateless JWT session strategy.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.sub = user.id;
        token.name = user.name;
      }
    
      return token;
    },
    async session({ session, token }) {

      // Transfer the id from the token to the session object.
      if (token.id) {
        session.user.id = token.id as string;
      } else if (token.sub) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === "development",
};