import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import logo from "../assets/blog.png";

const MotionLink = motion(Link);

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 font-extrabold text-gray-800 hover:opacity-80 transition"
      >
        <img
          src={logo}
          alt="Logo"
          className="w-25 h-11 object-contain rounded-full shadow-sm"
        />
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full shadow-sm">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <span className="text-black font-semibold text-lg">
                {user.name}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-700" />
            </motion.button>
          </>
        ) : (
          <>
            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full border border-blue-500 text-blue-600 font-medium 
                         hover:bg-blue-50 transition-all shadow-sm"
              to="/login"
            >
              Login
            </MotionLink>

            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                         text-white font-medium shadow-md hover:opacity-90 transition-all"
              to="/register"
            >
              Register
            </MotionLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
