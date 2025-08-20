import { Router } from "express";
import auth from "../middlewares/authMiddleware.js";
import { searchCtrl } from "../controllers/searchController.js";

const router = Router();
router.use(auth);
router.get("/", searchCtrl);

export default router;
