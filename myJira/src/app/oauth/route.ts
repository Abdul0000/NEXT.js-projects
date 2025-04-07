// src/app/oauth/route.js

import { AUTH_COOKIE } from "@/features/auth/constants";
import { createAdminCient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  if (!userId || !secret) {
    return NextResponse.redirect(`${request.nextUrl.origin}/signup`);
  }

  const { account } = await createAdminCient();
  const session = await account.createSession(userId, secret);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
