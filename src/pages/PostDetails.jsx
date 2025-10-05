import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://blog-app-api-production-8fde.up.railway.app/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        ⏳ Loading post...
      </p>
    );

  if (!post)
    return (
      <p className="text-center text-red-500 mt-10">
        ❌ Sorry, post not found.
      </p>
    );

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
              alt={post.author}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {post.author || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">
                {post.date || "Unknown Date"}
              </p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">
            {post.title}
          </h1>

          <p className="text-gray-700 leading-relaxed mb-4">
            {post.content}
          </p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
