import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(" Supabase URL/KEY missing. Add them in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
(async () => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Supabase connected successfully with service role!");
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
  }
})();

export default supabase;
