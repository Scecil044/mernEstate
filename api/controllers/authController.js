import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//@description create new user
//@access public route
//@route post request
export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.create({
      firstName,
      lastName,
      userName: firstName?.charAt(0)?.toUpperCase() + lastName?.toLowerCase(),
      email,
      password
    });
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

//@description create new user
//@access public route
//@route post request
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(403, "Invalid credentials"));
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(403, "invalid credentials"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.password = undefined;
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

//@description Logout
//@access public route
//@route post request
export const signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("logged out!");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const googleAuthentication = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.password = undefined;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user);
    } else {
      //extract name from req.body to get firstName and lastName
      const firstName = req.body.name.split(" ")[0];
      const lastName = req.body.name.split(" ")[1];
      const userName =
        req.body.name.split(" ").join("") +
        Math.floor(Math.random() * 10000)
          .toString(36)
          .split(-8);
      //Generate password since password is a required field
      const generatedPwd = Math.random()
        .toString(36)
        .slice(-8);
      const newUser = await User.create({
        firstName,
        lastName,
        userName,
        email: req.body.email,
        password: generatedPwd,
        avatar: req.body.photo
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      newUser.password = undefined;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUser);
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};
