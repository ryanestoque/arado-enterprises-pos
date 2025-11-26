import { Router } from "express";
import { addSupplier, deleteSupplier, getAllSuppliers, updateSupplier } from "../controllers/supplierController";

const router = Router();

router.get("/", getAllSuppliers);
router.post("/", addSupplier);
router.put("/:supplier_id", updateSupplier);
router.delete("/:supplier_id", deleteSupplier);

export default router;