import  supabase  from "../config/supabase.js";

const table = "users";

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createUser({ name, email, password }) {
  const { data, error } = await supabase
    .from(table)
    .insert([{ name, email, password }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findUserById(id) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}
