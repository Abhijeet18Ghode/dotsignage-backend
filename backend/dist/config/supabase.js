"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// Create Supabase client for general operations
exports.supabase = (0, supabase_js_1.createClient)(env_1.config.supabase.url, env_1.config.supabase.anonKey);
// Create Supabase client with service role for admin operations
exports.supabaseAdmin = (0, supabase_js_1.createClient)(env_1.config.supabase.url, env_1.config.supabase.serviceKey);
