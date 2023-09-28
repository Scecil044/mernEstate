import express from "express";
import { signUp, signIn, signOut, googleAuthentication } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/google", googleAuthentication);
router.get("/logout", signOut);

export default router;
