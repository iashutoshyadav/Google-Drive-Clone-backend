import supabase from "../config/supabase.js";

const table = "shares";

export async function createShare({ resource_type, resource_id, owner, target_email, permission, token }) {
  const { data, error } = await supabase
    .from(table)
    .insert({ resource_type, resource_id, owner, target_email, permission, token })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getShareByToken(token) {
  const { data, error } = await supabase.from(table).select("*").eq("token", token).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listSharesForOwner(owner) {
  const { data, error } = await supabase.from(table).select("*").eq("owner", owner).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function revokeShare(id, owner) {
  const { error } = await supabase.from(table).delete().eq("id", id).eq("owner", owner);
  if (error) throw error;
  return true;
}
