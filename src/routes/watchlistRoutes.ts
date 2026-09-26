import { Router } from "express";
import { addToWatchlist } from "../controllers/watchlistControllers.js";

const router = Router();

router.post("/", addToWatchlist);

export default router;
