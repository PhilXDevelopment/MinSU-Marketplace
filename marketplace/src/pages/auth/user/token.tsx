import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyToken() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Confirmation";
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-token",
        { code },
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(res.data.message || 'Login successfull');
        setTimeout(() => {
          navigate("/marketplace");
        }, 3000); // wait 1.5s to show toast
      }
      if (res.status === 401) {
        toast.success(res.data.message || 'Unauthorized Activity');
        setTimeout(() => {
          navigate("/auth/signin");
        }, 3000); // wait 1.5s to show toast
      }

      setCode("");
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/resend-code",
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "New code sent!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend code";
      setError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-4 tracking-wide">
         Enter Code
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter the 6-digit verification code sent to your email.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleVerify}>
          <div>
            <label className="text-gray-600 text-sm">Verification Code</label>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 bg-white text-gray-700
              focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="Enter 6-digit code"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-sm transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className={`w-full mt-4 py-3 rounded-xl text-emerald-700 font-semibold border border-emerald-500 shadow-sm transition ${
            resending ? "bg-gray-200 cursor-not-allowed" : "hover:bg-emerald-50"
          }`}
        >
          {resending ? "Resending..." : "Resend Code"}
        </button>

        {/* Marketplace Link */}
        <div className="text-center mt-4">
          <Link
            to="/marketplace"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Go to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
