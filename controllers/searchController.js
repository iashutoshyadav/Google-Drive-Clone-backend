import { searchFiles } from "../models/fileModel.js";
import { listChildren } from "../models/folderModel.js";

export async function searchCtrl(req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ folders: [], files: [] });

    const [files, folders] = await Promise.all([
      searchFiles(req.user.id, q),
      listChildren(req.user.id) // naive: list root folders then filter
    ]);

    const foldersFiltered = (folders || []).filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
    res.json({ folders: foldersFiltered, files: files || [] });
  } catch (e) { next(e); }
}
