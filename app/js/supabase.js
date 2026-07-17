import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://bujgkxwnskdewpaxmupa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YZV23zdfvsUwkx2GZVLCPA_Wd3ifzEb";

//EXPORT CLIENT INFO
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
