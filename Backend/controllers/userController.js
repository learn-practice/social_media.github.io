import User from "../models/userModel.js";
import Post from "../models/postModel.js";

import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
//we will fetch profile either with username or userid
//query can either be username or id
//get user profile
const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    //query is id
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in get Profile", error.message);
  }
};

//signup

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { password }] });
    if (user) {
      return res.status(400).json({ error: "User Already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookies(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        uswrname: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user Data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in signupUser:", error.message);
  }
};

//login user

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });
    generateTokenAndSetCookies(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in loginUser:", error.message);
  }
};
//logout user

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ error: "User Logged out Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in LogoutUser", error.message);
  }
};
//folow unfollow
const followUnfollowUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You can not follow or Unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not Found" });
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "user Unfollowed Successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "user followed Successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in Follow And Unfollow User", error.message);
  }
};

//user update

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User Not Found" });
    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You can not update others people  profile" });
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();
    //finding all posts that this user replies and update username and userProfilePic
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );
    //password should be null in response
    user.password = null;
    res.status(200).json({ message: "Profile update successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error on update User:", error.message);
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
};
