import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");
        console.log("Token:", token); 
        if (!token) {
            setError("You must be logged in to create a post.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/posts", { title, content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Post created successfully!");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create post");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create a New Post</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleCreatePost}>
                <div className="mb-3">
                    <label>Title:</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Content:</label>
                    <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success">Create Post</button>
            </form>
        </div>
    );
}

export default CreatePost;
