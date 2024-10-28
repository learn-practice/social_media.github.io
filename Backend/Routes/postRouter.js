import express from "express";
import {
  createPost,
  deletePost,
  getFeedPost,
  getPost,
  getUserPosts,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";
const Router = express.Router();
Router.get("/feed", protectRoute, getFeedPost);
Router.get("/:id", getPost);
Router.get("/user/:usrename", getUserPosts);
Router.post("/create", protectRoute, createPost);
Router.delete("/:id", protectRoute, deletePost);
Router.put("/liked/:id", protectRoute, likeUnlikePost);
Router.put("/reply/:id", protectRoute, replyToPost);

export default Router;
