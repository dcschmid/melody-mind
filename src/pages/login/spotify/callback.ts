import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

import type { APIContext } from "astro";
import { spotify, lucia } from "../../../auth";
import { db, eq, User } from "astro:db";

/**
 * Handles the Spotify OAuth2 callback.
 * This endpoint is called by Spotify after the user has authorized the app.
 * It validates the authorization code and creates a session for the user.
 * @param context The API context.
 * @returns A Response object.
 */
export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("spotify_oauth_state")?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // Validate the authorization code.
    const tokens = await spotify.validateAuthorizationCode(code);

    // Get the user information from the Spotify API.
    const spotifyUserResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const spotifyUser: SpotifyUser = await spotifyUserResponse.json();

    // Get the user's favorite artists.
    const followedArtistsResponse = await fetch("https://api.spotify.com/v1/me/following?type=artist", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const followedArtistsData = await followedArtistsResponse.json();
    const artistIds = followedArtistsData.artists.items.map((artist: any) => artist.id);

    // Get the details for each artist.
    const artistDetailsPromises = artistIds.map((artistId: string) => {
      return fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    });

    const artistDetailsResponses = await Promise.all(artistDetailsPromises);
    const artistDetailsData = await Promise.all(artistDetailsResponses.map((response) => response.json()));

    // Get the genres for each artist.
    const artistGenres = artistDetailsData.flatMap((artist: any) => artist.genres);

    const favoriteSongsResponse = await fetch("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const favoriteSongsData = await favoriteSongsResponse.json();
    const songIds = favoriteSongsData.items.map((song: any) => song.track.id);

    const songDetailsPromises = songIds.map((songId: string) => {
      return fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    });

    const songDetailsResponses = await Promise.all(songDetailsPromises);
    const songDetailsData = await Promise.all(songDetailsResponses.map((response) => response.json()));

    const songArtistIds = songDetailsData.map((song: any) => song.artists[0].id);

    const songArtistDetailsPromises = songArtistIds.map((artistId: string) => {
      return fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    });

    const songArtistDetailsResponses = await Promise.all(songArtistDetailsPromises);
    const songArtistDetailsData = await Promise.all(songArtistDetailsResponses.map((response) => response.json()));

    const genres = songArtistDetailsData.flatMap((artist: any) => artist.genres);

    const formattedArtistGenres = artistGenres.map((genre) => genre.replace(/\s+/g, "-"));
    const formattedSongGenres = genres.map((genre) => genre.replace(/\s+/g, "-"));

    // Merge genres and remove duplicates.
    const mergedGenres = [...new Set([...formattedArtistGenres, ...formattedSongGenres])];

    const existingUser = await db.select().from(User).where(eq(User.provider_id, spotifyUser.id));

    if (existingUser[0]) {
      const session = await lucia.createSession(existingUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      await db
        .update(User)
        .set({ favorite_genres: JSON.stringify(mergedGenres) })
        .where(eq(User.id, existingUser[0].id));

      return context.redirect("/gamehome");
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await db.insert(User).values({
      id: userId,
      provider_id: spotifyUser.id,
      provider_type: "spotify",
      username: spotifyUser.display_name ?? "",
      email: spotifyUser.email ?? "",
      avatar_url: spotifyUser.images[0]?.url ?? "",
      total_user_points: "0",
      favorite_genres: JSON.stringify(mergedGenres),
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return context.redirect("/gamehome");
  } catch (e) {
    console.log(e);
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
