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

module.exports = router;
