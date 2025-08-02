import express from "express";
import {
  createPost,
  getAllPosts,
  getUserProfile,
  updateUserProfile,
  deletePost,
} from "../controllers/postController.js";
import validateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", validateToken, createPost);
router.get("/", getAllPosts);
router.get("/profile/:userId", getUserProfile);
router.put("/profile", validateToken, updateUserProfile);
router.delete("/:postId", validateToken, deletePost);
export default router;
