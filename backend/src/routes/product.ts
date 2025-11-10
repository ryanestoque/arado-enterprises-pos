import { Router } from "express";
import { addProducts, getAllProducts } from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.post("/", addProducts)

export default router;