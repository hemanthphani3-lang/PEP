import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase credentials - loaded from env vars (safe for client-side NEXT_PUBLIC_ prefix)
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ovsysmmmotxrdjnxpnxq.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92c3lzbW1tb3R4cmRqbnhwbnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDIxODEsImV4cCI6MjA5ODc3ODE4MX0.negJwtB-IrTb2GH9YgLz-pNYDLWwxLkGPYCRHWyIf2A";

// Singleton client — created once, reused across the app
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null; // SSR guard
  if (!_client && SUPABASE_URL && SUPABASE_ANON_KEY) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// Named export used throughout db.ts
export const supabase = getSupabaseClient();
