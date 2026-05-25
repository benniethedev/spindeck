/**
 * PressBase Middleware Helper
 * Handles session refresh for Next.js middleware
 * 
 * Usage in middleware.js:
 *   import { updateSession } from "@/libs/pressbase/middleware";
 *   export async function middleware(request) {
 *     return await updateSession(request);
 *   }
 */

import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_PRESSBASE_URL || "https://backend.benbond.dev/wp-json/app/v1";

const TOKEN_KEY = "pb_access_token";
const REFRESH_KEY = "pb_refresh_token";

export async function updateSession(request) {
  let response = NextResponse.next({
    request,
  });

  const token = request.cookies.get(TOKEN_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESH_KEY)?.value;

  if (!token) {
    return response;
  }

  // Verify token is still valid
  try {
    const verifyResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (verifyResponse.ok) {
      // Token is valid
      return response;
    }

    // Token expired, try to refresh
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();

        // Create new response with updated cookies
        response = NextResponse.next({
          request,
        });

        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        };

        response.cookies.set(TOKEN_KEY, data.access_token, cookieOptions);
        
        if (data.refresh_token) {
          response.cookies.set(REFRESH_KEY, data.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }

        return response;
      }
    }

    // Refresh failed - clear cookies
    response.cookies.delete(TOKEN_KEY);
    response.cookies.delete(REFRESH_KEY);
    
  } catch (error) {
    console.error("PressBase middleware error:", error);
  }

  return response;
}

export default updateSession;
