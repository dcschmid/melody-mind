import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

import type { APIContext } from "astro";
import { google, lucia } from "../../../auth";
import { db, eq, User } from "astro:db";

/**
 * Handle the Google OAuth2 callback.
 * This endpoint is called by Google after the user has authorized the app.
 * It validates the authorization code and creates a session for the user.
 * @param context The API context.
 * @returns A Response object.
 */
export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = context.cookies.get("google_code_verifier")?.value as string;

  // Check if the state and code verifier are valid.
  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // Validate the authorization code.
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Get the user information from the Google API.
    const googleUser: any = await googleUserResponse.json();

    // Check if the user already exists in the database.
    const existingUser = await db.select().from(User).where(eq(User.provider_id, googleUser.sub));

    if (existingUser[0]) {
      // If the user already exists, create a session for the user.
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return context.redirect("/gamehome");
    }

    // If the user does not exist, create a new user in the database.
    const userId = generateIdFromEntropySize(10); // 16 characters long
    await db.insert(User).values({
      id: userId,
      provider_id: googleUser.sub,
      provider_type: "google",
      username: googleUser.name,
      email: googleUser.email ?? "",
      avatar_url: googleUser.picture ?? "",
      total_user_points: 0,
      favorite_genres: [],
    })

    // Create a session for the new user.
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return context.redirect("/gamehome");
  } catch (e) {
    // Handle errors.
    if (e instanceof OAuth2RequestError) {
      // If the authorization code is invalid, return a 400 error.
      return new Response(null, {
        status: 400,
      });
    }
    // If there is an unexpected error, return a 500 error.
    return new Response(null, {
      status: 500,
    });
  }
}
