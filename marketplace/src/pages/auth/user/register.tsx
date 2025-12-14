import { useEffect, useState, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const apiurl = "http://localhost:3000/api";
  const navigate = useNavigate();

  const initialState = {
    avatar: null,
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    birthday: "",
    email: "",
    password: "",
    schoolid: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const avatarRef = useRef(); // Ref for file input

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files.length > 0) {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "avatar" && formData.avatar) {
          data.append("avatar", formData.avatar);
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post(`${apiurl}/auth/register`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        toast.success(res.data.message || "Account created successfully!");
        setTimeout(() => {
          navigate("/auth/verify");
        }, 3000); // wait 1.5s to show toast
      }
      setFormData(initialState);

      // Clear file input manually
      if (avatarRef.current) {
        avatarRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Create Account";
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-6 tracking-wide">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          {/* Avatar */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">Avatar</label>
            <input
              type="file"
              name="avatar"
              ref={avatarRef}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="text-gray-600 text-sm">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter first name"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="text-gray-600 text-sm">Middle Name</label>
            <input
              type="text"
              name="middlename"
              placeholder="Enter middle name"
              value={formData.middlename}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-gray-600 text-sm">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter last name"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-gray-600 text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Birthday */}
          <div>
            <label className="text-gray-600 text-sm">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* School ID */}
          <div>
            <label className="text-gray-600 text-sm">
              School ID (Optional)
            </label>
            <input
              type="text"
              name="schoolid"
              placeholder="Enter school ID"
              value={formData.schoolid}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-sm transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Terms & Conditions */}
        <p className="text-center text-gray-600 text-sm mt-4">
          By signing up, you agree to our{" "}
          <Link
            to="/auth/signin"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Terms
          </Link>
          ,{" "}
          <Link
            to="/auth/signin"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            to="/auth/signin"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Cookies Policy
          </Link>
          .
        </p>

        {/* Already have an account */}
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
