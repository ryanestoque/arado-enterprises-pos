import { Router } from "express";
import { addSupplier, deleteSupplier, getAllActiveSuppliers, getAllSuppliers, updateSupplier } from "../controllers/supplierController";

const router = Router();

router.get("/", getAllSuppliers);
router.get("/active", getAllActiveSuppliers);
router.post("/", addSupplier);
router.put("/:supplier_id", updateSupplier);
router.delete("/:supplier_id", deleteSupplier);

export default router;