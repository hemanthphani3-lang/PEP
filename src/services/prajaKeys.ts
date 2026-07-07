// Keys are loaded from the NEXT_PUBLIC_PRAJA_KEYS environment variable (comma-separated)
export const PRAJA_KEYS = process.env.NEXT_PUBLIC_PRAJA_KEYS 
  ? process.env.NEXT_PUBLIC_PRAJA_KEYS.split(",").map(k => k.trim()).filter(Boolean)
  : [];

// Helper to get a random key for load balancing
export function getRandomPrajaKey(): string {
  const randomIndex = Math.floor(Math.random() * PRAJA_KEYS.length);
  return PRAJA_KEYS[randomIndex];
}
