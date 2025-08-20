import supabase from "../config/supabase.js";

const table = "files";

//  Create file
export async function createFile({ name, user_id, folder_id = null, size, type, url }) {
  const { data, error } = await supabase
    .from(table)
    .insert({ name, user_id, folder_id, size, type, url, trashed: false }) // add trashed flag
    .select()
    .single();

  if (error) throw error;
  return data;
}

//  List files in a folder (only non-trashed)
export async function listFiles(user_id, folder_id = null) {
  const query = supabase
    .from(table)
    .select("*")
    .eq("user_id", user_id)
    .eq("trashed", false) // exclude trashed files
    .order("created_at", { ascending: false });

  const { data, error } = folder_id
    ? await query.eq("folder_id", folder_id)
    : await query.is("folder_id", null);

  if (error) throw error;
  return data;
}

//  Get file by ID
export async function getFileById(id) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

//  Move file to another folder
export async function moveFile(id, user_id, folder_id = null) {
  const { data, error } = await supabase
    .from(table)
    .update({ folder_id })
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

//  Hard delete (immediate remove)
export async function deleteFile(id, user_id) {
  const { data, error } = await supabase
    .from(table)
    .select("url")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) throw error;

  const { error: delError } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (delError) throw delError;

  return data?.url || null;
}

//  Soft delete (move to trash)
export async function trashFile(id, user_id) {
  const { error } = await supabase
    .from(table)
    .update({ trashed: true })
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) throw error;
  return true;
}

//  Restore from trash
export async function restoreFile(id, user_id) {
  const { error } = await supabase
    .from(table)
    .update({ trashed: false })
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) throw error;
  return true;
}

//  Permanently delete trashed file
export async function purgeFile(id, user_id) {
  const { data, error } = await supabase
    .from(table)
    .select("url")
    .eq("id", id)
    .eq("user_id", user_id)
    .eq("trashed", true) // only purge trashed files
    .single();

  if (error) throw error;

  const { error: delError } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", user_id)
    .eq("trashed", true);

  if (delError) throw delError;

  return data?.url || null;
}

//  Search files by name (excluding trashed)
export async function searchFiles(user_id, q) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", user_id)
    .eq("trashed", false)
    .ilike("name", `%${q}%`);

  if (error) throw error;
  return data;
}
