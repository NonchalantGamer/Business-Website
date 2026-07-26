// supabase-config.js
// Load Supabase JS Client via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Replace these placeholders with the values from Supabase Settings -> API
const SUPABASE_URL = 'https://rfibvngppotttdtnelvf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmaWJ2bmdwcG90dHRkdG5lbHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMTQwODksImV4cCI6MjEwMDU5MDA4OX0.cb5Sy2n3dMBrfugqPr6dWocrBioUbPBecFJX8J91uX4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);