import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import {
  deleteFileCtrl,
  downloadFileCtrl,
  listFilesCtrl,
  moveFileCtrl,
  uploadFileCtrl,
  trashFileCtrl,
  restoreFileCtrl,
  purgeFileCtrl
} from "../controllers/fileController.js";

const router = Router();
router.use(auth);

router.get("/", listFilesCtrl);
router.post("/upload", upload.single("file"), uploadFileCtrl);
router.get("/:id/download", downloadFileCtrl);
router.patch("/:id/move", moveFileCtrl);
router.patch("/:id/trash", trashFileCtrl);
router.patch("/:id/restore", restoreFileCtrl);
router.delete("/:id/purge", purgeFileCtrl);
router.delete("/:id", deleteFileCtrl);

export default router;
