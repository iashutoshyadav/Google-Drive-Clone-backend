import {
  createFile,
  deleteFile,
  getFileById,
  listFiles,
  moveFile,
  trashFile,
  restoreFile,
  purgeFile
} from "../models/fileModel.js";

import {
  uploadBufferToSupabase,
  getSignedUrl,
  removeFromStorage
} from "../utils/uploadHelper.js";

//  Upload a new file
export async function uploadFileCtrl(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { folder_id = null } = req.body;
    const url = await uploadBufferToSupabase(req.user.id, req.file);

    const meta = await createFile({
      name: req.file.originalname,
      user_id: req.user.id,
      folder_id: folder_id || null,
      size: req.file.size,
      type: req.file.mimetype,
      url
    });

    res.status(201).json(meta);
  } catch (e) {
    next(e);
  }
}

//  List files
export async function listFilesCtrl(req, res, next) {
  try {
    const { folder_id = null } = req.query;
    const files = await listFiles(req.user.id, folder_id || null);
    res.json(files);
  } catch (e) {
    next(e);
  }
}

//  Download file
export async function downloadFileCtrl(req, res, next) {
  try {
    const file = await getFileById(req.params.id);
    if (!file || file.user_id !== req.user.id) {
      return res.status(404).json({ message: "File not found" });
    }

    const url = await getSignedUrl(file.url);
    res.json({ url });
  } catch (e) {
    next(e);
  }
}

//  Move file into another folder
export async function moveFileCtrl(req, res, next) {
  try {
    const { folder_id = null } = req.body;
    const updated = await moveFile(req.params.id, req.user.id, folder_id);
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

//  Hard delete immediately
export async function deleteFileCtrl(req, res, next) {
  try {
    const url = await deleteFile(req.params.id, req.user.id);
    if (url) await removeFromStorage(url);

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

//  Soft delete (trash)
export async function trashFileCtrl(req, res) {
  try {
    await trashFile(req.params.id, req.user.id);
    res.json({ success: true, message: "File moved to trash" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

//  Restore from trash
export async function restoreFileCtrl(req, res) {
  try {
    await restoreFile(req.params.id, req.user.id);
    res.json({ success: true, message: "File restored" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

//  Purge (permanent delete from trash)
export async function purgeFileCtrl(req, res) {
  try {
    const url = await purgeFile(req.params.id, req.user.id);
    if (url) await removeFromStorage(url);

    res.json({ success: true, message: "File permanently deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
