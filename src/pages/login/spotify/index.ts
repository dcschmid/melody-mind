import { generateState } from "arctic";

import type { APIContext } from "astro";
import { spotify } from "../../../auth";

export async function GET(context: APIContext): Promise<Response> {
	const state = generateState();
	const url = await spotify.createAuthorizationURL(state);

	context.cookies.set("spotify_oauth_state", state, {
		path: "/",
		secure: import.meta.env.PROD,
		httpOnly: import.meta.env.DEV,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return context.redirect(url.toString());
}