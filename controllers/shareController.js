import crypto from "crypto";
import { getFileById } from "../models/fileModel.js";
import { getFolderById } from "../models/folderModel.js";
import { createShare, getShareByToken, listSharesForOwner, revokeShare } from "../models/shareFileModel.js";
import { getSignedUrl } from "../utils/uploadHelper.js";

export async function createShareCtrl(req, res, next) {
  try {
    const { resource_type, resource_id, target_email, permission = "viewer" } = req.body;
    if (!["file", "folder"].includes(resource_type)) return res.status(400).json({ message: "Invalid resource_type" });

    // Ownership check
    if (resource_type === "file") {
      const f = await getFileById(resource_id);
      if (!f || f.owner !== req.user.id) return res.status(404).json({ message: "Resource not found" });
    } else {
      const f = await getFolderById(resource_id);
      if (!f || f.owner !== req.user.id) return res.status(404).json({ message: "Resource not found" });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const share = await createShare({
      resource_type,
      resource_id,
      owner: req.user.id,
      target_email,
      permission,
      token
    });

    res.status(201).json({ ...share, link: `/api/share/access/${token}` });
  } catch (e) { next(e); }
}

export async function mySharesCtrl(req, res, next) {
  try {
    const shares = await listSharesForOwner(req.user.id);
    res.json(shares);
  } catch (e) { next(e); }
}

export async function revokeShareCtrl(req, res, next) {
  try {
    await revokeShare(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (e) { next(e); }
}

export async function accessShareCtrl(req, res, next) {
  try {
    const { token } = req.params;
    const share = await getShareByToken(token);
    if (!share) return res.status(404).json({ message: "Invalid link" });

    if (share.resource_type === "file") {
      // return signed URL for file
      const file = await getFileById(share.resource_id);
      if (!file) return res.status(404).json({ message: "File missing" });
      const url = await getSignedUrl(file.path);
      return res.json({ type: "file", name: file.name, mime: file.mime, url, permission: share.permission });
    } else {
      // For folder: in a simple version just echo metadata (listing omitted for brevity)
      return res.json({ type: "folder", id: share.resource_id, permission: share.permission });
    }
  } catch (e) { next(e); }
}
