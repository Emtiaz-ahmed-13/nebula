import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

// Use dynamic base URL for both client and server environments
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use current origin
    return `${window.location.origin}`;
  }
  
  // Server-side: use VERCEL_URL in production or localhost in development
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return "http://localhost:3000";
};

export const client = treaty<App>(getBaseUrl()).api
