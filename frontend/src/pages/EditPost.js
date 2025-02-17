import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                setError("Failed to load post.");
            }
        };

        fetchPost();
    }, [id]);

    const handleEditPost = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.put(`http://localhost:5000/api/posts/${id}`, { title, content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Post updated successfully!");
            navigate(`/post/${id}`);
        } catch (err) {
            setError("Failed to update post.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Edit Post</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleEditPost}>
                <div className="mb-3">
                    <label>Title:</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Content:</label>
                    <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success">Update Post</button>
            </form>
        </div>
    );
}

export default EditPost;
