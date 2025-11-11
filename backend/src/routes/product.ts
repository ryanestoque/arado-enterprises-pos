import { Router } from "express";
import { addProducts, deleteProduct, getAllProducts, updateProduct } from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.post("/", addProducts);
router.put("/:product_id", updateProduct);
router.delete("/:product_id", deleteProduct);

export default router;