import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 rounded ${isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 rounded ${!isLogin ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Register
        </button>
      </div>

      {isLogin ? <Login /> : <Register />}
    </div>
  );
}
