import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateTokenandSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const user = await User.findOne({ userName });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    await newUser.save();

    if (newUser) {
      //generate jtw token
      generateTokenandSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate jtw token
    generateTokenandSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
      semSite: "strict",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};
