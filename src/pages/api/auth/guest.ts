import type { APIRoute } from "astro";

import { generateId } from "../../../utils/auth/generateId";

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Generate a unique guest user ID
    const guestId = `guest_${generateId()}`;

    // Create a guest session cookie
    const sessionData = {
      id: guestId,
      username: "Guest",
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Set the session cookie (expires in 30 days)
    cookies.set("guest_session", JSON.stringify(sessionData), {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Guest session created successfully",
        user: sessionData,
        redirectUrl: "/en/gamehome", // Default redirect to game home
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating guest session:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to create guest session",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
