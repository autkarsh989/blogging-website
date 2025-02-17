import React, { useEffect, useState } from "react";

import axios from "axios";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/posts");
                setPosts(res.data);
            } catch (err) {
                setError("Failed to fetch posts");
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Blog Posts</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            {posts.length === 0 ? <p>No posts available.</p> : (
                posts.map(post => (
                    <div key={post._id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{post.title}</h5>
                            <p className="card-text">{post.content}</p>
                            <small className="text-muted">By {post.author?.name || "Unknown"}</small>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
