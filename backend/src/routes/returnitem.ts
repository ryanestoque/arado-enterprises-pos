import { Router } from "express";
import { deleteReturn, getAllReturns, makeReturn, updateReturn } from "../controllers/returnitemController";

const router = Router();

router.get("/", getAllReturns);
router.post("/", makeReturn);
router.put("/:return_id", updateReturn);
router.delete("/:return_id", deleteReturn);

export default router;