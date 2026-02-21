import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yjpchjyipxsabqmukccc.supabase.co";
const SUPABASE_ANON_KEY = "Sb_publishable_FYno3uvNf3PgNoz-xpYpGA__W3rwAiH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
