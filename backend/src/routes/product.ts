import { Router } from "express";
import { addProducts, getAllProducts, updateProduct } from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.post("/", addProducts);
router.put("/:product_id", updateProduct);;

export default router;