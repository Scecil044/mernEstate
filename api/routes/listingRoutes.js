import express from "express";
import {
  createListing,
  updateListing,
  deleteListing,
  getUserListings,
  editListing,
  getListing,
  getListings
} from "../controllers/listingsController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();
//routes
router.post("/create", verifyUser, createListing);
router.put("/update", verifyUser, updateListing);
router.delete("/delete", verifyUser, deleteListing);
router.get("/my-listings/:id", verifyUser, getUserListings);
router.delete("/delete/:id", verifyUser, deleteListing);
router.put("/update/:id", verifyUser, editListing);
router.get("/get-listing/:id", verifyUser, getListing);
router.get("/", getListings);

export default router;
