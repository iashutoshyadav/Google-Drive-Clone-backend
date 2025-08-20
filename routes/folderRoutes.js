import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  createFolderCtrl,
  deleteFolderCtrl,
  listFolderContentCtrl,
  renameFolderCtrl
} from "../controllers/folderController.js";

const router = Router();
router.use(auth);

router.get("/", listFolderContentCtrl);
router.get("/:id", listFolderContentCtrl);
router.post("/", createFolderCtrl);
router.patch("/:id", renameFolderCtrl);
router.delete("/:id", deleteFolderCtrl);

export default router;
