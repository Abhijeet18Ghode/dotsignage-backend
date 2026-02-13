const { createClient } = require('@supabase/supabase-js');
const { config } = require('./env');

// Create Supabase client for general operations
const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

module.exports = { supabase, supabaseAdmin };
