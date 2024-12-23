import { supabase } from '../lib/supabase';

// Get Supabase URL and anon key from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// API URL configuration
export const API_CONFIG = {
  baseUrl: `${SUPABASE_URL}/functions`,
  version: 'v1'
};

// Full API URL
export const API_URL = `${API_CONFIG.baseUrl}`;

// Function to get API example with dynamic host
export function getApiExample(apiKey: string): string {
  return `curl -X POST \\
  ${API_URL}/events \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "apikey: ${SUPABASE_ANON_KEY}" \\
  -d '{
    "event": "PageView",
    "url": "https://example.com/page",
    "lead": {
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "data": {
      "customField": "value"
    }
  }'`;
}