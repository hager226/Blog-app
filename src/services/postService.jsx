const API_URL = "http://localhost:5000";

export const getPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  return await res.json();
};

export const createPost = async (postData, token) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  return await res.json();
};
