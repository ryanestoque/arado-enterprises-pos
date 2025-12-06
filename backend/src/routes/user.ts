import { Router } from "express";
import { addUser, changePassword, changeUsername, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.get("/:user_id", getUser);
router.post("/", addUser);
router.put("/:user_id", updateUser);
router.put("/change-username/:user_id", changeUsername);
router.put("/change-password/:user_id", changePassword);
router.delete("/:user_id", deleteUser);

export default router;