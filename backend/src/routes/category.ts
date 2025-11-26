import { Router } from "express";
import { getAllCategories, addCategory, updateCategory, deleteCategory} from "../controllers/categoryController";

const router = Router();

router.get("/", getAllCategories);
router.post("/", addCategory);
router.put("/:category_id", updateCategory);
router.delete("/:category_id", deleteCategory);

export default router;