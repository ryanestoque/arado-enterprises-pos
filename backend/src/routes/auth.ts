import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);

export default router;