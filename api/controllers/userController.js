import User from "../models/userModel.js";

//@description function to update user
//@Access this is a private and protected route
//@route PUT method
export const updateUser = async (req, res, next) => {
  try {
    const user = User.findOne({ email: req.body.email });
  } catch (error) {
    next(error);
  }
};

//@description function to update user
//@Access this is a private and protected route
//@route PUT method
export const deleteAccount = async (req, res, next) => {
    try {
      const user = User.findOne({ email: req.body.email });
    } catch (error) {
      next(error);
    }
  };
