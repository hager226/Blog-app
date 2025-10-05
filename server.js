// server.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

// 🆔 فانكشن generic لحساب ID جديد لأي collection
const getNextId = (collection) => {
  if (!collection || collection.length === 0) return 1;
  return Math.max(...collection.map((item) => item.id)) + 1;
};

// 📌 Register
server.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));
  const users = db.users || [];

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: getNextId(users),
    name,
    email,
    password,
  };

  users.push(newUser);
  db.users = users;
  fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db, null, 2));

  res.status(201).json({ user: newUser });
});

// 📌 Login
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));
  const users = db.users || [];

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  res.json({ user });
});

// 📌 Add Post
server.post("/posts", (req, res) => {
  const { title, content, image, author } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));
  const posts = db.posts || [];

  const newPost = {
    id: getNextId(posts),
    title,
    content,
    image,
    author,
    date: new Date().toISOString(),
  };

  posts.push(newPost);
  db.posts = posts;
  fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db, null, 2));

  res.status(201).json(newPost);
});

// 👇 أي راوت تاني يتعامل مع router العادي
server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running on http://localhost:${PORT}`);
});
