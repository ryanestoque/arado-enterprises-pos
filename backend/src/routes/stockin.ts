import { Router } from "express";
import { getAllStockin, makeStockin } from "../controllers/stockinController";

const router = Router();

router.get("/", getAllStockin);
router.post("/", makeStockin);

export default router;