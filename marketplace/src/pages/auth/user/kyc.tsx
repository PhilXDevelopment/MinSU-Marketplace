import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { FaArrowLeft } from "react-icons/fa";

export default function KYC_Form() {
  const apiurl = "http://localhost:3000";
  const navigate = useNavigate();

  const initialState = {
    usertype: "",
    idno: "",
    idtype: "",
    front: null,
    back: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const frontRef = useRef();
  const backRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if ((name === "front" || name === "back") && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (name === "front") setFrontPreview(ev.target.result);
        if (name === "back") setBackPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let user = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {}
    }

    if (!user) {
      toast.error("User not found. Please login first.");
      navigate("/auth/signin");
      return;
    }

    try {
      const data = new FormData();
      const kycid = uuidv4();
      data.append("kycid", kycid);
      data.append("userid", user.userid);
      data.append("usertype", formData.usertype);
      data.append("idno", formData.idno);
      data.append("idtype", formData.idtype);
      data.append("status", "Pending");

      if (formData.front) data.append("front", formData.front);
      if (formData.back) data.append("back", formData.back);

      const res = await axios.post(`${apiurl}/api/auth/kyc-submit`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        toast.success(res.data.message || "KYC submitted successfully!");
        setTimeout(() => navigate("/myprofile"), 2000);
      }

      setFormData(initialState);
      setFrontPreview(null);
      setBackPreview(null);
      if (frontRef.current) frontRef.current.value = "";
      if (backRef.current) backRef.current.value = "";
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
    document.title = "KYC Verification";
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-700 font-semibold mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-6 tracking-wide">
          KYC Verification
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
          {/* User Type */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">User Type</label>
            <select
              name="usertype"
              value={formData.usertype}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              required
            >
              <option value="">Select User Type</option>
              <option value="Student">Student</option>
              <option value="Non-student">Non-student</option>
            </select>
          </div>

          {/* ID Number */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">ID Number</label>
            <input
              type="text"
              name="idno"
              placeholder="Enter your ID number"
              value={formData.idno}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* ID Type */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">ID Type</label>
            <select
              name="idtype"
              value={formData.idtype}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              required
            >
              <option value="">Select ID Type</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
              <option value="School ID">School ID</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Front Upload */}
          <div>
            <label className="text-gray-600 text-sm">Front of ID</label>
            <input
              type="file"
              name="front"
              ref={frontRef}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            {frontPreview && (
              <img
                src={frontPreview}
                alt="Front Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Back Upload */}
          <div>
            <label className="text-gray-600 text-sm">Back of ID</label>
            <input
              type="file"
              name="back"
              ref={backRef}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            {backPreview && (
              <img
                src={backPreview}
                alt="Back Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Submit */}
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
              {loading ? "Submitting..." : "Submit KYC"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
