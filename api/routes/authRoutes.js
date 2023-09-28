import express from "express";
import { signUp, signIn, signOut } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.get("/logout", signOut);

export default router;
