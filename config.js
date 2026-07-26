/**
 * Supabase Configuration
 * Replace these values with your actual Supabase project credentials
 * Get them from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (CDN import)
// Add this to your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

async function initSupabase() {
  if (typeof window === 'undefined') return null;
  
  if (!window.supabase) {
    console.error('Supabase client not loaded. Add to HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return supabaseClient;
}

function getSupabase() {
  return supabaseClient;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSupabase, getSupabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}
