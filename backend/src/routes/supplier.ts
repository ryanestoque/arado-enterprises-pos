import { Router } from "express";
import { getAllSuppliers } from "../controllers/supplierController";

const router = Router();

router.get("/", getAllSuppliers);

export default router;