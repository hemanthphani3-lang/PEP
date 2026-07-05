import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://ovsysmmmotxrdjnxpnxq.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92c3lzbW1tb3R4cmRqbnhwbnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDIxODEsImV4cCI6MjA5ODc3ODE4MX0.negJwtB-IrTb2GH9YgLz-pNYDLWwxLkGPYCRHWyIf2A";

export function getSupabaseConfig() {
  if (typeof window === "undefined") {
    return { url: DEFAULT_URL, key: DEFAULT_KEY };
  }
  const url = localStorage.getItem("civicpulse_supabase_url") || DEFAULT_URL;
  const key = localStorage.getItem("civicpulse_supabase_key") || DEFAULT_KEY;
  return { url, key };
}

const { url, key } = getSupabaseConfig();

export const supabase = (url && key) ? createClient(url, key) : null;
