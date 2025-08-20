import supabase from "../config/supabase.js";
import { deleteFile } from "./fileModel.js";
const table = "folders";

//  Create a folder
export async function createFolder({ name, user_id, parent = null }) {
  const { data, error } = await supabase
    .from(table)
    .insert({ name, user_id, parent_id: parent })
    .select()
    .single();
  if (error) throw error;
  return data;
}

//  Get folder by ID
export async function getFolderById(id) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

//  List children of a folder
export async function listChildren(user_id, parent = null) {
  const query = supabase.from(table).select("*").eq("user_id", user_id);

  const { data, error } = parent
    ? await query.eq("parent_id", parent)
    : await query.is("parent_id", null);
  if (error) throw error;
  return data;
}

//  Rename folder
export async function renameFolder(id, user_id, name) {
  const { data, error } = await supabase
    .from(table)
    .update({ name })
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

//  Delete folder
export async function deleteFolder(id, user_id) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) throw error;
  return true;
}
