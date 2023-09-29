import express from "express";
import { createListing, updateListing, deleteListing } from "../controllers/listingsController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
//routes
router.post("/create", verifyUser, createListing);
router.put("/update", verifyUser, updateListing);
router.delete("/delete", verifyUser, deleteListing);

export default router;
