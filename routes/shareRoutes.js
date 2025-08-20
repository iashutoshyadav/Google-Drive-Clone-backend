import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  accessShareCtrl,
  createShareCtrl,
  mySharesCtrl,
  revokeShareCtrl
} from "../controllers/shareController.js";

const router = Router();

router.use(auth);
router.get("/", mySharesCtrl);
router.post("/", createShareCtrl);
router.delete("/:id", revokeShareCtrl);

// public-ish access (still behind token), no auth required:
router.get("/access/:token", accessShareCtrl);

export default router;
