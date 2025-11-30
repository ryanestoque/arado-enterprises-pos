import { Router } from "express";
import { addUser, deleteUser, getAllUsers, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

export default router;