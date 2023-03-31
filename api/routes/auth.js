import express from "express";
import { login, register, logout, verifyToken } from "../controllers/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", verifyToken);

export default router;
