import { Router } from "express";
import { addUser, changeUsername, deleteUser, getAllUsers, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:user_id", updateUser);
router.put("/:user_id", changeUsername);
router.delete("/:user_id", deleteUser);

export default router;