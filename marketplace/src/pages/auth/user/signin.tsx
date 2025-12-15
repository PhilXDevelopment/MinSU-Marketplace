import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const apiurl = "http://localhost:3000/";
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const checksession = async () => {
    try {
      const res = await axios.post(`${apiurl}api/auth/onsession`, {
        userid: user.userid,
      });

      // Check if backend says session is valid
      if (
        res.data.status === true &&
        res.data.session &&
        res.data.session.status === "LOGGED IN"
      ) {
        // save the session or user (whatever you want)
        localStorage.setItem("user", JSON.stringify(res.data.session));
      }
      if (
        res.data.status === true &&
        res.data.session &&
        res.data.session.status === "LOGGED OUT"
      ) {
        // save the session or user (whatever you want)
        localStorage.removeItem("user");
      }

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    document.title = "Login";
    checksession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    localStorage.clear();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      // SUCCESS LOGIN (200)
      if (res.status === 200) {
        toast.success(res.data.message || "Check your email!");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/auth/verify-token");
        }, 2000);
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Login failed";

      // HANDLE 401 - WRONG CREDENTIALS
      if (status === 401) {
        toast.error(msg || "Email or password is wrong");
        setError(msg);
        return;
      }

      // HANDLE 422 - ACCOUNT EXISTS BUT NOT VERIFIED
      if (status === 422) {
        toast.error(msg);
        return navigate("/auth/verify");
      }

      // HANDLE 500 - SERVER ERROR
      if (status === 500) {
        toast.error(
          msg || "Something went wrong! Please contact the administrator."
        );
        setError(msg);
        return;
      }

      // OTHER ERRORS
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-6 tracking-wide">
          Login
        </h2>

        {/* ERROR BANNER */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 bg-white text-gray-700
              focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 bg-white text-gray-700
              focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter password"
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-sm transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-emerald-100"></div>
            <span className="text-gray-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-emerald-100"></div>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Go to?{" "}
          <Link
            to="/"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Marketplace
          </Link>
        </p>
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
