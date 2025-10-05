import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


const MotionLink = motion(Link);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setErrorMessage("");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const success = await login(data);

    if (success) {
      setTimeout(() => navigate("/"), 600);
    } else {
      setErrorMessage("❌ Incorrect email or password");
      setTimeout(() => setErrorMessage(""), 2500); // auto hide after 2.5s
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-3xl p-8 flex flex-col items-center"
      >
        <motion.h2
          className="text-3xl font-extrabold text-gray-800 mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome Back 👋
        </motion.h2>

        <motion.p
          className="text-gray-600 text-sm text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Login to continue your journey
        </motion.p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          {/* Email */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white/90"
              {...register("email", {
                required: "⚠️ Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "⚠️ Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition bg-white/90"
              {...register("password", { required: "⚠️ Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          {/* Error Box */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-md p-2 text-center text-sm"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={!isSubmitting ? { scale: 1.03 } : {}}
            whileTap={!isSubmitting ? { scale: 0.97 } : {}}
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-blue-400 to-purple-400 text-white py-3 rounded-lg font-semibold shadow-md transition flex justify-center items-center gap-2 ${
              isSubmitting
                ? "opacity-80 cursor-not-allowed"
                : "hover:opacity-90 cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Register link */}
        <motion.p
          className="text-gray-700 text-sm mt-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Don’t have an account?{" "}
          <MotionLink
            to="/register"
            className="text-blue-500 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Create one
          </MotionLink>
        </motion.p>
      </motion.div>
    </div>
  );
}
