import express from "express";
import { deleteAccount, logout, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

//routes
router.put("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteAccount);
router.get("/logout", logout);

export default router;
