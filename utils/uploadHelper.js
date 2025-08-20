import supabase from "../config/supabase.js";
import crypto from "crypto";

const BUCKET = process.env.SUPABASE_BUCKET || "files";

export async function uploadBufferToSupabase(ownerId, file) {
  const ext = file.originalname.includes(".")
    ? file.originalname.split(".").pop()
    : "";
  const nameSafe = file.originalname.replace(/[^\w.\-]+/g, "_");

  const key = `${ownerId}/${Date.now()}_${crypto.randomBytes(6).toString("hex")}_${nameSafe}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(key, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;
  return data.path;
}

export async function getSignedUrl(path) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 10); // 10 minutes

  if (error) throw error;
  return data.signedUrl;
}

export async function removeFromStorage(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
