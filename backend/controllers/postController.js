import Post from "../models/postModel.js";
import User from "../models/Authmodel.js";

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  const { content } = req.body;
  const authorId = req.data.id;
  if (!content) {
    return res.status(400).json({ message: "Post content cannot be empty." });
  }
  let post = await Post.create({
    content,
    author: authorId,
  });
  post = await post.populate("author", "name picture");
  res.status(201).json(post);
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate("author", "name picture")
    .sort({ createdAt: -1 }); // -1 for descending order

  res.status(200).json(posts);
};

// @desc    Get a user's profile and their posts
// @route   GET /api/posts/profile/:userId
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "name picture");
    res.status(200).json({
      user,
      posts,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update the logged-in user's profile
// @route   PUT /api/posts/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.data.id;
    const { name, bio, picture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, picture },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const loggedInUserId = req.data.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the logged-in user is the author of the post
    if (post.author.toString() !== loggedInUserId) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};
