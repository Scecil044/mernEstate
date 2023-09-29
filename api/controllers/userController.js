import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

//@description function to update user
//@Access this is a private and protected route
//@route PUT method
export const updateUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      next(errorHandler(403, "You can only update your account"));
    }
    //find user by id and update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        //$set allows update to me made only on entered fields
        $set: {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          password: req.body.password, //The alternative method to this is checking if req.body.password and generating a hashed pwd
          avatar: req.body.avatar
        }
      },
      { new: true }
    );
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//@description function to update user
//@Access this is a private and protected route
//@route PUT method
export const deleteAccount = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      next(errorHandler(403, "Not allowed!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("access_token")
      .status(200)
      .json("account deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const logout = async (Req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("logout successful");
  } catch (error) {
    next(error);
  }
};
