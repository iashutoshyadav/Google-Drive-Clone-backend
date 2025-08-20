import { createFolder, deleteFolder, getFolderById, listChildren, renameFolder } from "../models/folderModel.js";
import { listFiles } from "../models/fileModel.js";

// Create new folder
export async function createFolderCtrl(req, res) {
  try {
    const { name, parent_id = null } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Folder name required" });

    const folder = await createFolder({
      name,
      user_id: req.user.id,
      parent_id
    });
    res.status(201).json({ success: true, message: "Folder created successfully", folder });
  } catch (e) {
    console.error("createFolderCtrl error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
}

// List children (folders + files)
export async function listFolderContentCtrl(req, res) {
  try {
    const parent_id = req.params.id || null;
    const folders = await listChildren(req.user.id, parent_id);
    const files = await listFiles(req.user.id, parent_id);
    res.json({ success: true, folders, files });
  } catch (e) {
    console.error("listFolderContentCtrl error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
}

// Rename a folder
export async function renameFolderCtrl(req, res) {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) return res.status(400).json({ success: false, message: "New folder name required" });
    const updated = await renameFolder(id, req.user.id, name);
    res.json({ success: true, message: "Folder renamed successfully", folder: updated });
  } catch (e) {
    console.error("renameFolderCtrl error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
}

// Delete a folder
export async function deleteFolderCtrl(req, res) {
  try {
    const { id } = req.params;
    const folder = await getFolderById(id);
    if (!folder || folder.user_id !== req.user.id) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }
    await deleteFolder(id, req.user.id);
    res.json({ success: true, message: "Folder deleted successfully" });
  } catch (e) {
    console.error("deleteFolderCtrl error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
}
