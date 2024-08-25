import { generateCodeVerifier, generateState } from "arctic";

import type { APIContext } from "astro";
import { google } from "../../../auth";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  context.cookies.set("google_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: import.meta.env.DEV,
	maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  // store code verifier as cookie
  context.cookies.set("google_code_verifier", codeVerifier, {
    secure: import.meta.env.PROD, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return context.redirect(url.toString());
}
