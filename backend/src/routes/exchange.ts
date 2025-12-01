import { Router } from "express";
import { getAllExchanges, makeExchange } from "../controllers/exchangeController";

const router = Router();

router.get("/", getAllExchanges);
router.post("/", makeExchange);

export default router;