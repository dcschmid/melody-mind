import { verify } from "@node-rs/argon2";

import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { lucia } from "../../auth";
import { generateIdFromEntropySize } from "lucia";

/**
 * Handles the login API call.
 * @param context The API context.
 * @returns A Response object.
 */
export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const userId = generateIdFromEntropySize(10); // 16 characters long
  const password = formData.get("password");
  const email = formData.get("email");

  // Check if the email is valid
  if (!email || typeof email !== "string") {
    return new Response("Invalid email", {
      status: 400,
    });
  }

  // Check if the password is valid
  if (!password || typeof password !== "string") {
    return new Response(null, {
      status: 400,
    });
  }

  // Retrieve the user from the database
  const existingUser = await db.select().from(User).where(eq(User.email, email.toLowerCase()));

  // If the user doesn't exist, return an error response
  if (!existingUser[0]) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return new Response("Incorrect email or password", {
      status: 400,
    });
  }

  // Verify the password
  const validPassword = await verify(existingUser[0].password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // If the password is invalid, return an error response
  if (!validPassword) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  // Create a new session for the user
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  // Redirect the user to the homepage
  return context.redirect("/");
}
