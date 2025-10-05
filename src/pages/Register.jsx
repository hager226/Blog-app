import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1200)); 
    const success = await signup(data);

    if (success) {
      setTimeout(() => navigate("/"), 600);
    } else {
      alert("❌ Registration failed, please try again.");
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
          Create Account ✨
        </motion.h2>

        <motion.p
          className="text-gray-600 text-sm text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Fill in your details to get started
        </motion.p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white/90"
              {...register("name", { required: "⚠️ Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </motion.div>

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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition bg-white/90"
              {...register("password", {
                required: "⚠️ Password is required",
                minLength: {
                  value: 6,
                  message: "⚠️ Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition bg-white/90 ${
                errors.confirmPassword
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-200"
              }`}
              {...register("confirmPassword", {
                required: "⚠️ Please confirm your password",
                validate: (value) =>
                  value === password || "⚠️ Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>

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
                <span>Creating...</span>
              </>
            ) : (
              "Register"
            )}
          </motion.button>
        </form>

        <motion.p
          className="text-gray-700 text-sm mt-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Already have an account?{" "}
          <MotionLink
            to="/login"
            className="text-blue-500 hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Login here
          </MotionLink>
        </motion.p>
      </motion.div>
    </div>
  );
}
