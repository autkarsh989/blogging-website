const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new post
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content, author: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "name");
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET a single post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name _id");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a post
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update the post
        post.title = title;
        post.content = content;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Server error" });
    }
})


// Delete a post 
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
