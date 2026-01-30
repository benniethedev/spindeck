/**
 * PressBase API Client Library
 * Drop-in replacement for Supabase that uses PressBase backend
 * 
 * @module @/libs/pressbase
 */

// Re-export client for use in browser components
export { createClient } from "./client.js";

// Re-export server client for use in API routes and server components
export { createClient as createServerClient, createServiceClient } from "./server.js";

// Re-export middleware helper
export { updateSession } from "./middleware.js";
