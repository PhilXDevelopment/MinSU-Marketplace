import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-6 tracking-wide">
          Create Account
        </h2>

        <div className="space-y-5">
          {/* FULL NAME */}
          <div>
            <label className="text-gray-600 text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-emerald-200 
              text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-emerald-200 
              text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-emerald-200 
              text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          {/* CREATE ACCOUNT BUTTON */}
          <button
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 
            text-white font-semibold shadow-sm transition"
          >
            Create Account
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-emerald-100"></div>
            <span className="text-gray-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-emerald-100"></div>
          </div>

          {/* GOOGLE */}
          <button
            className="w-full bg-white text-gray-800 py-3 rounded-xl font-semibold 
            flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100 transition"
          >
            <img src="/google.png" className="w-5" />
            Sign up with Google
          </button>

          {/* FACEBOOK */}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold 
            flex items-center justify-center gap-3 hover:bg-blue-700 transition"
          >
            <img src="/facebook.png" className="w-5" />
            Sign up with Facebook
          </button>
        </div>

        {/* ALREADY HAVE ACCOUNT */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
