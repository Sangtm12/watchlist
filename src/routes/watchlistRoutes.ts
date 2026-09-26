import { Router } from "express";
import { addToWatchlist } from "../controllers/watchlistControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", addToWatchlist);

export default router;
