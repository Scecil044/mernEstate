import express from "express";
import { deleteAccount, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

//routes
router.put("/update/:id", verifyUser, updateUser);

export default router;
