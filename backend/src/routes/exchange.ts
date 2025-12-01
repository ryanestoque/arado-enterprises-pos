import { Router } from "express";
import { deleteExchange, getAllExchanges, makeExchange, updateExchange } from "../controllers/exchangeController";

const router = Router();

router.get("/", getAllExchanges);
router.post("/", makeExchange);
router.put("/:exchange_id", updateExchange);
router.delete("/:exchange_id", deleteExchange);

export default router;