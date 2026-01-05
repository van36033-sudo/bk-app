import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://smgrmdavolyaivslypou.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_ukqRkVkK9jvmNXFRWoNhAw_zLPMVNsh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
