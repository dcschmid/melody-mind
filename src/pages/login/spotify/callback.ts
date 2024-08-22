import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

import type { APIContext } from "astro";
import { spotify, lucia } from "../../../auth";
import { db, eq, User } from "astro:db";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("spotify_oauth_state")?.value;

  console.log(code, state, storedState);

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);

    console.log(tokens);

    const spotifyUserResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const spotifyUser: SpotifyUser = await spotifyUserResponse.json();

    // Replace this with your own DB client.
    const existingUser = await db.select().from(User).where(eq(User.provider_id, spotifyUser.id));

    if (existingUser[0]) {
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return context.redirect("/gamehome");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    // Replace this with your own DB client.
    await db.insert(User).values({
      id: userId,
      provider_id: spotifyUser.id,
      provider_type: "spotify",
      user_name: spotifyUser.display_name ?? "",
      email: spotifyUser.email ?? "",
      avatar_url: spotifyUser.images[0]?.url ?? "",
      totalUserPoints: 0,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return context.redirect("/gamehome");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface SpotifyUser {
  id: string;
  display_name: string;
  images: { url: string; width: number; height: number }[];
  email: string;
}
