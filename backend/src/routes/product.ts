import { Router } from "express";
import { addProducts, deleteProduct, getAllProducts, getTotalInventoryValue, getTotalQuantity, updateProduct } from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.get("/total_quantity", getTotalQuantity);
router.get("/total_inventory_value", getTotalInventoryValue);
router.post("/", addProducts);
router.put("/:product_id", updateProduct);
router.delete("/:product_id", deleteProduct);

export default router;