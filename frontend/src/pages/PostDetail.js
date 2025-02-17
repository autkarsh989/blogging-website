import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                setError("Post not found.");
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Post deleted successfully!");
            navigate("/");
        } catch (err) {
            setError("Failed to delete post.");
        }
    };

    return (
        <div className="container mt-5">
            {error && <p className="text-danger">{error}</p>}
            {post && (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <small className="text-muted">
                        By <strong>{post.author?.name || "Unknown"}</strong>
                    </small>

                    {/* Show Edit/Delete buttons if logged-in user is the author */}
                    {user && user.id === post.author?._id && (
                        <div className="mt-3">
                            <button className="btn btn-danger me-2" onClick={handleDelete}>
                                Delete
                            </button>
                            <button className="btn btn-warning" onClick={() => navigate(`/edit-post/${id}`)}>
                                Edit
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PostDetail;
