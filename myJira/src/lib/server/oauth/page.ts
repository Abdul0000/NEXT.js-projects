// src/lib/server/oauth.js
"use server";

import { createAdminCient } from "../../appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

export async function signUpWithGithub() {
	const { account } = await createAdminCient()

    const origin = (await headers()).get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${origin}/oauth`,
		`${origin}/`,
	);

	return redirect(redirectUrl);
};

export async function signUpWithGoogle() {
	const { account } = await createAdminCient()

    const origin = (await headers()).get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Google,
		`${origin}/oauth`,
		`${origin}/`,
	);

	return redirect(redirectUrl);
};
