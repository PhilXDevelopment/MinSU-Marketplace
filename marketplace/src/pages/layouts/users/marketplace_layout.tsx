import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { HiBadgeCheck, HiOutlineIdentification } from "react-icons/hi";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Marketplace_Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const apiurl = "http://localhost:3000/";
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [verify, setverify] = useState("");

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  const handlesignout = async () => {
    try {
      await axios.post(`${apiurl}api/auth/signout`, {
        userid: user?.userid,
      });
    } catch (error) {}
    localStorage.removeItem("user");
    navigate("/auth/signin");
    setMenuOpen(false);
  };

  const handlekyc = () => {
    navigate("/auth/kyc");
  };

  const checksession = async () => {
    try {
      if (!user) return;
      const res = await axios.post(`${apiurl}api/auth/onsession`, {
        userid: user.userid,
      });
      console.log(user);
      if (res.data.session == null) {
        localStorage.removeItem("user");
        navigate("/auth/signin");
      }

      if (
        res.data.status === true &&
        res.data.session &&
        res.data.session.status === "LOGGED IN"
      ) {
        localStorage.setItem("user", JSON.stringify(res.data.session));
      }
      if (
        res.data.status === true &&
        res.data.session &&
        res.data.session.status === "LOGGED OUT"
      ) {
        localStorage.removeItem("user");
      }

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checksession();
    console.log(user);
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800 flex flex-col relative">
      <div className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center">
          <img
            src={`${apiurl}uploads/static/marketplacelogo.png`}
            alt=""
            className="h-15 object-cover"
          />
          <h1 className="text-lg font-bold text-emerald-700">Marketplace</h1>
        </div>
        <button
          className="text-emerald-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 sm:hidden bg-white z-40 flex flex-col p-7 animate-fadeIn">
            <button
              className="text-emerald-700 text-3xl self-end mb-6"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes />
            </button>

            {user && (
              <div className="text-center mb-6">
                <img
                  src={`${apiurl}uploads/avatar`}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-emerald-600"
                  alt="Profile"
                />
                <p className="mt-3 text-xl font-semibold text-emerald-700">
                  {toSentenceCase(user.firstname)}
                </p>
              </div>
            )}

            {user ? (
              <div className="flex flex-col space-y-4 text-lg font-semibold">
                <Link
                  to="/myprofile"
                  className="text-emerald-700 hover:text-emerald-900 flex items-center gap-3"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUser /> My Profile
                </Link>

                {user?.verify_status === "FULLY VERIFIED" ? (
                  <p className="flex text-nowrap items-center gap-3">
                    <HiBadgeCheck /> Fully Verified
                  </p>
                ) : user?.verify_status == null &&
                  user?.kyc_status === "PENDING" ? (
                  <button
                    type="button"
                    disabled
                    className="text-gray-600 flex items-center gap-3"
                  >
                    <HiOutlineIdentification /> KYC Submitted
                  </button>
                ) : user?.kyc_status === "DECLINED" ? (
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-3"
                    onClick={handlekyc}
                  >
                    <HiOutlineIdentification /> Re-apply KYC
                  </button>
                ) : (
                  user?.verify_status == null && (
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-3"
                      onClick={handlekyc}
                    >
                      <HiOutlineIdentification /> Apply KYC
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 flex items-center gap-3"
                  onClick={handlesignout}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth/signin"
                className="text-emerald-700 hover:text-emerald-900 text-lg font-semibold flex items-center gap-3"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser /> Sign In
              </Link>
            )}
          </div>

          <div className="hidden sm:block absolute top-16 right-4 bg-white shadow-lg rounded-xl p-4 w-56 z-40 animate-fadeIn">
            {user && (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`${apiurl}uploads/avatars/${user.avatar}`}
                  className="w-12 h-12 rounded-full border-2 border-emerald-600"
                  alt="Profile"
                />
                <div className="font-semibold text-emerald-700">
                  {toSentenceCase(user.firstname)}
                </div>
              </div>
            )}
            {user ? (
              <div className="flex flex-col space-y-4 text-md font-semibold">
                <Link
                  to="/myprofile"
                  className="text-emerald-700 hover:text-emerald-900 flex items-center gap-3"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUser /> My Profile
                </Link>

                {user?.verify_status === "FULLY VERIFIED" ? (
                  <p className="flex text-nowrap items-center gap-3">
                    <HiBadgeCheck /> Fully Verified
                  </p>
                ) : user?.kyc_status === "DECLINED" ? (
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-3"
                    onClick={handlekyc}
                  >
                    <HiOutlineIdentification /> Re-submit your KYC
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-3"
                    onClick={handlekyc}
                  >
                    <HiOutlineIdentification /> Apply KYC
                  </button>
                )}

                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 flex items-center gap-3"
                  onClick={handlesignout}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth/signin"
                className="text-emerald-700 hover:text-emerald-900 flex items-center gap-3"
                onClick={() => setMenuOpen(false)}
              >
                <FaUser /> Sign In
              </Link>
            )}
          </div>
        </>
      )}

      <div className="p-4 flex-1 relative">
        <ToastContainer />
        <Outlet />
      </div>

      <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:border-r-2 flex sm:justify-center sm:border-b-2 md:border-b-0 sm:p-3">
            <img
              src={`${apiurl}uploads/static/minsulogo.png`}
              alt=""
              className="h-32"
            />
            <img
              src={`${apiurl}uploads/static/bagongpilipinas.png`}
              alt=""
              className="h-32"
            />
            <img
              src={`${apiurl}uploads/static/liftminsu.png`}
              alt=""
              className="h-32"
            />
          </div>
          <div className="lg:border-r-2 sm:border-b-2 md:border-b-0 sm:p-3">
            <p className=" text-2xl  text-green-500 font-bold ">
              Mindoro State University
            </p>
            <p>
              <span className="underline text-yellow-500 font-semibold">R</span>{" "}
              ESILIENCE
            </p>
            <p>
              <span className="underline text-yellow-500 font-semibold">I</span>{" "}
              NTEGRITY
            </p>
            <p>
              <span className="underline text-yellow-500 font-semibold">C</span>{" "}
              OMMITMENT
            </p>
            <p>
              <span className="underline text-yellow-500 font-semibold">E</span>{" "}
              XCELLENCE
            </p>
          </div>
          <div className="">
            <p className=" text-xl  text-white font-bold ">Contact Us</p>
            <div className="">
              <p>Address: Alcate, Victoria Oriental Mindoro</p>
              <p>Email: universitypresident@minsu.edu.ph</p>
              <p>Phone: +639778467228</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-xs mt-10 border-t border-gray-700 pt-4">
          <div className="justify-center flex">
            <img
              src={`${apiurl}uploads/static/ictlogo.png`}
              alt=""
              className="h-16"
            />
          </div>

          <div className="">
            © {new Date().getFullYear()} ICT Unit Marketplace — All Rights
            Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
