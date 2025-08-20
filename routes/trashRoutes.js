import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  listFilesCtrl,        // use this to list trashed items (filter inside controller)
  restoreFileCtrl,
  purgeFileCtrl
} from "../controllers/fileController.js";

const router = Router();
router.use(auth);

router.get("/", (req, res, next) => {
  req.query.trashed = true; // force filter
  listFilesCtrl(req, res, next);
});

router.patch("/files/:id/restore", restoreFileCtrl);
router.delete("/files/:id", purgeFileCtrl);

export default router;
