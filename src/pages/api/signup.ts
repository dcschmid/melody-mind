import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";

import type { APIContext } from "astro";
import { lucia } from "../../auth";
import { isValidEmail } from "../../utils/auth/isValidEmail";
import { db, User } from "astro:db";

/**
 * @description Handles the signup API call.
 * @param {APIContext} context Context of the API call.
 * @returns {Promise<Response>} A Response object.
 */
export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email");
  const userId = generateIdFromEntropySize(10); // 16 characters long

  // Check if the username is valid
  if (
    !username ||
    typeof username !== "string" ||
    // username must be between 4 ~ 31 characters
    username.length < 3 ||
    username.length > 31 ||
    // username must only consists of lowercase letters, 0-9, -, and _
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response("Invalid username", {
      status: 400,
    });
  }

  // Check if the email is valid
  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return new Response("Invalid email", {
      status: 400,
    });
  }

  // Check if the password is valid
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  // Hash the password
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // Create a new user in the database
  await db.insert(User).values({
    id: userId,
    provider_id: "",
    provider_type: "email",
    username: username,
    email: email,
    password_hash: passwordHash,
    avatar_url: "",
    totalUserPoints: 0,
  });

  // Create a new session for the user
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  // Redirect the user to the game home page
  return context.redirect("/gamehome");
}
