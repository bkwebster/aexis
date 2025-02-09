import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

export const useSupabase = (): SupabaseClient<Database> => {
  return createClient();
};
