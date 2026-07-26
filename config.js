/**
 * Supabase Configuration
 * Replace these values with your actual Supabase project credentials
 * Get them from: https://app.supabase.com/project/Business-Website/settings/api
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rfibvngppotttdtnelvf.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmaWJ2bmdwcG90dHRkdG5lbHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMTQwODksImV4cCI6MjEwMDU5MDA4OX0.cb5Sy2n3dMBrfugqPr6dWocrBioUbPBecFJX8J91uX4';

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
