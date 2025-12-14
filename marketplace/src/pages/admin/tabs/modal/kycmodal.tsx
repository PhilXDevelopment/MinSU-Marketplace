// KycModal.jsx
import axios from "axios";
import { useState } from "react";
import { FaTimes, FaRegImage } from "react-icons/fa";
import { toast } from "react-toastify";

export default function KycModal({ isOpen, onClose, kyc, apiUrl }) {
      interface User {
        firstname: string;
        lastname: string;
        avatar: string;
        userid: string;
      }
      let user: User | null = null;
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (err) {
          console.error("Invalid user data in localStorage", err);
          user = null;
        }
      }
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !kyc) return null;

  const handleSubmit = async (status) => {
    try {
      setLoading(true);
      const data = { kycid: kyc.kycid, status,userid:user?.userid,adminid:user?.userid };
      const res = await axios.post(`${apiUrl}api/kyc/process`, data);
      toast.success(res.data.message);
      setLoading(false);
      onClose(); // close modal after action
    } catch (err) {
      console.error(err);
      toast.error("Error processing KYC");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main KYC Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] relative scrollbar-hide">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold transition"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>

          {/* Header: Avatar Left, Details Right */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            {/* Avatar */}
            {kyc.avatar && (
              <div
                className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={() =>
                  setPreviewImage(`${apiUrl}${kyc.avatar.replace(/\\/g, "/")}`)
                }
              >
                <img
                  src={`${apiUrl}${kyc.avatar.replace(/\\/g, "/")}`}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 border-emerald-600 object-cover shadow-lg"
                />
              </div>
            )}

            {/* User Details */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                <FaRegImage className="text-emerald-600" /> KYC Details
              </h2>
              <span className="text-gray-500 text-sm mb-4 block">
                Verify user information and documents
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="truncate">
                  <p className="text-gray-500 text-sm font-medium">Type</p>
                  <p className="text-gray-800 font-semibold truncate">
                    {kyc.usertype}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      kyc.status === "PENDING"
                        ? "bg-yellow-200 text-yellow-800"
                        : kyc.status === "APPROVED"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {kyc.status}
                  </span>
                </div>
                <div className="truncate">
                  <p className="text-gray-500 text-sm font-medium">
                    First Name
                  </p>
                  <p className="text-gray-800 font-semibold truncate">
                    {kyc.firstname}
                  </p>
                </div>
                <div className="truncate">
                  <p className="text-gray-500 text-sm font-medium">
                    Middle Name
                  </p>
                  <p className="text-gray-800 font-semibold truncate">
                    {kyc.middlename}
                  </p>
                </div>
                <div className="sm:col-span-2 truncate">
                  <p className="text-gray-500 text-sm font-medium">Last Name</p>
                  <p className="text-gray-800 font-semibold truncate">
                    {kyc.lastname}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {kyc.front && (
              <div
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center"
                onClick={() =>
                  setPreviewImage(`${apiUrl}${kyc.front.replace(/\\/g, "/")}`)
                }
              >
                <p className="font-semibold text-gray-700 mb-2">Front ID</p>
                <img
                  src={`${apiUrl}${kyc.front.replace(/\\/g, "/")}`}
                  alt="Front ID"
                  className="w-full h-48 object-contain rounded-md border"
                />
              </div>
            )}
            {kyc.back && (
              <div
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center"
                onClick={() =>
                  setPreviewImage(`${apiUrl}${kyc.back.replace(/\\/g, "/")}`)
                }
              >
                <p className="font-semibold text-gray-700 mb-2">Back ID</p>
                <img
                  src={`${apiUrl}${kyc.back.replace(/\\/g, "/")}`}
                  alt="Back ID"
                  className="w-full h-48 object-contain rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              className={`w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition flex items-center justify-center ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-green-600 hover:to-green-700"
              }`}
              onClick={() => handleSubmit("APPROVED")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Approve"}
            </button>
            <button
              className={`w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition flex items-center justify-center ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-red-600 hover:to-red-700"
              }`}
              onClick={() => handleSubmit("DECLINED")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="relative max-w-2xl w-full">
            <button
              className="absolute top-2 right-2 z-50 bg-white text-gray-800 hover:bg-gray-200 rounded-full p-2 text-3xl flex items-center justify-center shadow-lg transition"
              onClick={() => setPreviewImage(null)}
              aria-label="Close Preview"
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Tailwind Scrollbar Hide */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
}
