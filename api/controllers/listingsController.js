import Listing from "../models/listingModel.js";

export const createListing = async (req, res, next) => {
  try {
    res.status(200).json("listing creation");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    res.status(200).json("listing creation");
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    res.status(200).json("listing creation");
  } catch (error) {
    next(error);
  }
};