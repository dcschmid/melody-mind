import type { APIContext } from "astro";
import { lucia } from "../../auth";

/**
 * Log the user out by invalidating their session and removing their session cookie.
 * If the user is not logged in, return a 401 Unauthorized response.
 * @param context The API context.
 * @returns A Response object.
 */
export async function POST(context: APIContext): Promise<Response> {
	// Check if the user is logged in
	if (!context.locals.session) {
		return new Response(null, {
			// Return a 401 Unauthorized response if the user is not logged in
			status: 401
		});
	}

	// Invalidate the user's session
	await lucia.invalidateSession(context.locals.session.id);

	// Create a new session cookie with a blank value
	const sessionCookie = lucia.createBlankSessionCookie();

	// Set the session cookie
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// Redirect the user to the homepage
	return context.redirect("/");
}
