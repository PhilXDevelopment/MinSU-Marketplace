import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    document.title = "Login"
  }, [])
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-6 tracking-wide">
          Login
        </h2>

        <div className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-emerald-200 
              text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter email"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-emerald-200 
              text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter password"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 
          text-white font-semibold shadow-sm transition"
          >
            Login
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-emerald-100"></div>
            <span className="text-gray-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-emerald-100"></div>
          </div>


        </div>

        {/* NO ACCOUNT LINK */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
