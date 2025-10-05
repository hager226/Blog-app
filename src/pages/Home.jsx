import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThumbsUp, MessageCircle, Share2, Edit3, X, Trash2 } from "lucide-react";
import Swal from "sweetalert2"; 

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", image: "" });
  const commentInputRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://blog-app-api-production-8fde.up.railway.app/posts?_sort=id&_order=desc");
        const data = await res.json();

        const normalized = data.map((p) => ({
          ...p,
          likes: p.likes || 0,
          likesUsers: p.likesUsers || [],
          comments: p.comments || [],
        }));

        setPosts(normalized);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    if (!user) {
      alert("⚠️ You must be logged in to like a post!");
      return;
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const alreadyLiked = post.likesUsers?.includes(user.email);
          const updatedPost = {
            ...post,
            likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
            likesUsers: alreadyLiked
              ? post.likesUsers.filter((u) => u !== user.email)
              : [...(post.likesUsers || []), user.email],
          };

          fetch(`https://blog-app-api-production-8fde.up.railway.app/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPost),
          });

          return updatedPost;
        }
        return post;
      })
    );
  };

  const handleAddComment = async (id, text) => {
    if (!user) {
      alert("⚠️ You must be logged in to comment!");
      return;
    }
    if (!text.trim()) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [...post.comments, { user: user.name || user.email, text }],
            }
          : post
      )
    );

    const postToUpdate = posts.find((p) => p.id === id);
    if (postToUpdate) {
      const updatedPost = {
        ...postToUpdate,
        comments: [...postToUpdate.comments, { user: user.name || user.email, text }],
      };
      await fetch(`https://blog-app-api-production-8fde.up.railway.app/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
    }
  };

  const handleDeleteComment = async (postId, index) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments.filter((_, i) => i !== index) }
          : post
      )
    );

    const postToUpdate = posts.find((p) => p.id === postId);
    if (postToUpdate) {
      const updatedPost = {
        ...postToUpdate,
        comments: postToUpdate.comments.filter((_, i) => i !== index),
      };
      await fetch(`https://blog-app-api-production-8fde.up.railway.app/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditForm({
      title: post.title,
      content: post.content || post.description || "",
      image: post.image || "",
    });
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setEditForm((f) => ({ ...f, image: reader.result }));
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const updatedPost = {
      title: editForm.title,
      content: editForm.content,
      image: editForm.image,
    };

    await fetch(`https://blog-app-api-production-8fde.up.railway.app/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });

    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedPost } : p)));
    setEditingPostId(null);
  };

  const handleDeletePost = async (id) => {
    const result = await Swal.fire({
      title: "⚠️ Are you sure?",
      text: "This post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`https://blog-app-api-production-8fde.up.railway.app/posts/${id}`, {
        method: "DELETE",
      });

      setPosts((prev) => prev.filter((p) => p.id !== id));

      Swal.fire("Deleted!", "✅ Your post has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting post:", error);
      Swal.fire("Error!", "❌ Failed to delete post", "error");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        ⏳ Loading posts...
      </p>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 relative">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">📰 News Feed</h1>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts found.</p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden transition hover:shadow-xl duration-300"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="font-medium text-gray-800">{post.author}</p>
                  </div>

                  {user && (user.name === post.author || user.email === post.author) && (
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          editingPostId === post.id
                            ? setEditingPostId(null)
                            : handleEditClick(post)
                        }
                        className="text-gray-500 hover:text-blue-600 transition cursor-pointer"
                      >
                        {editingPostId === post.id ? <X size={18} /> : <Edit3 size={18} />}
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-gray-500 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {editingPostId === post.id ? (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, post.id)}
                    className="p-5 space-y-4 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Edit title..."
                    />

                    <textarea
                      rows="4"
                      value={editForm.content}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, content: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Edit content..."
                    />

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Change Image
                      </label>

                      <input
                        id={`fileEdit-${post.id}`}
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />

                      <label
                        htmlFor={`fileEdit-${post.id}`}
                        className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                      >
                        {editForm.image ? (
                          <img
                            src={editForm.image}
                            alt="preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            📂 Click to Upload New Image
                          </span>
                        )}
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <>
                    {post.image && (
                      <img
                        onClick={() => navigate(`/posts/${post.id}`)}
                        src={post.image}
                        alt={post.title}
                        className="w-full aspect-[16/9] object-cover rounded-t-xl cursor-pointer"
                      />
                    )}
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                        {post.title}
                      </h2>
                      <p className="text-gray-600">
                        {(post.content || post.description || "").length > 200
                          ? (post.content || post.description).slice(0, 200) + "..."
                          : post.content || post.description}
                      </p>
                    </div>
                  </>
                )}

                <div className="flex justify-around border-t border-gray-100 p-3 text-sm">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition cursor-pointer ${
                      post.likesUsers?.includes(user?.email)
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <ThumbsUp size={18} /> {post.likes}
                  </button>

                  <div
                    onClick={() => {
                      setActiveCommentPost(post.id);
                      setTimeout(() => {
                        commentInputRefs.current[post.id]?.focus();
                      }, 100);
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer"
                  >
                    <MessageCircle size={18} /> {post.comments.length}
                  </div>

                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition cursor-pointer">
                    <Share2 size={18} /> Share
                  </button>
                </div>

                <div className="px-5 pb-4">
                  <h3 className="text-gray-700 font-medium mt-3 mb-2">Comments</h3>

                  {post.comments.length > 0 ? (
                    <ul className="space-y-2 mb-3">
                      {post.comments.map((c, index) => (
                        <li
                          key={index}
                          className="bg-gray-100 p-2 rounded-md text-sm flex justify-between items-center"
                        >
                          <span>
                            <span className="font-semibold">{c.user}: </span>
                            {c.text}
                          </span>

                          {user &&
                            (c.user === user.name || c.user === user.email) && (
                              <button
                                onClick={() =>
                                  handleDeleteComment(post.id, index)
                                }
                                className="text-red-500 text-xs hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm mb-3">No comments yet.</p>
                  )}

                  {user && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(
                          post.id,
                          e.target.elements.comment.value
                        );
                        e.target.reset();
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        name="comment"
                        placeholder="Write a comment..."
                        ref={(el) => (commentInputRefs.current[post.id] = el)}
                        className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                            activeCommentPost === post.id
                              ? "ring-2 ring-blue-300"
                              : ""
                          }`}
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition cursor-pointer"
                      >
                        Post
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {user && (
          <Link
            to="/create-post"
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-400 to-sky-300 text-white 
               w-16 h-16 flex items-center justify-center rounded-full 
               shadow-md hover:rotate-12 hover:scale-110 transition-all duration-200 text-3xl font-bold cursor-pointer"
          >
            +
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
