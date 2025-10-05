import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AddPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const newPost = {
      title,
      content,
      image,
      author: user?.name || user?.username || "Anonymous",
      date: new Date().toLocaleDateString(),
    };

    try {
      const res = await fetch("https://blog-app-api-production-8fde.up.railway.app/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("Failed to add post");

      const savedPost = await res.json();
      navigate("/", { state: { newPost: savedPost } });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          ✍️ Create a New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Post Title *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none bg-white"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Image
            </label>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <label
              htmlFor="fileInput"
              className={`flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                image
                  ? "border-blue-300 bg-blue-50 hover:bg-blue-100"
                  : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              {image ? (
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-full object-cover rounded-2xl shadow-sm transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/80 text-sm text-blue-600 font-medium px-3 py-1 rounded-full shadow">
                    Change Image
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <span className="text-blue-500 text-3xl font-bold">+</span>
                  </div>
                  <p className="font-medium">Click to upload an image</p>
                  <p className="text-sm text-slate-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </label>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description *
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-4 py-3 h-40 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none resize-none bg-white"
              placeholder="Write your amazing story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-400 text-white py-3 rounded-xl font-semibold text-lg shadow hover:opacity-90 transition cursor-pointer"
          >
            🚀 Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPost;
