import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthProvider";
import AddPost from "./pages/NewPost";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Toaster position="top-center" reverseOrder={false} />

        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/create-post" element={<AddPost />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
