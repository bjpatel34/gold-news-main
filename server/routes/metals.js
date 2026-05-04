import express from "express";
import { getMetals, getMetalBySymbol } from "../controllers/metalsController.js";

const router = express.Router();

// GET /api/metals         → Gold + Silver combined
router.get("/", getMetals);

// GET /api/metals/:symbol → Single metal (XAU or XAG)
router.get("/:symbol", getMetalBySymbol);

export default router;
