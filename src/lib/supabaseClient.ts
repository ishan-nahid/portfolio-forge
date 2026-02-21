import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yjpchjyipxsabqmukccc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcGNoanlpcHhzYWJxbXVrY2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTc2ODgsImV4cCI6MjA4NzIzMzY4OH0.IxUKnyBHswAh1Y27UfiqROpSjqXicXnoYA47jTrSeHw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
