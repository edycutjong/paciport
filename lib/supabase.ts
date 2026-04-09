import { createClient } from "@supabase/supabase-js";

// Mock Supabase config for Pacifica demo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pacifica-demo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.pacifica-demo";

// Create a mocked client if missing, but ideally use standard createClient
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to fetch encrypted exchange credentials (mocked for demo)
export async function getExchangeCredentials(userId: string, exchangeId: string) {
  // In a real app, this decrypts the API keys from the secure `exchange_keys` table.
  // For the hackathon demo, we return safe, mock credentials.
  return {
    apiKey: `mock-api-key-${exchangeId}`,
    secret: `mock-secret-${exchangeId}`,
  };
}
