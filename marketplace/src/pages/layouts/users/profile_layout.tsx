import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaHeart,
  FaUserFriends,
  FaImages,
  FaCheckCircle,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import Showcase from "../../users/profile/showcase/showcase";
import Cart from "../../users/profile/cart/cart";
import Follow from "../../users/profile/follow/Follow";
import Likes from "../../users/profile/likes/likes";
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import axios from "axios";

export default function Profile_Layout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "showcase" | "cart" | "follow" | "likes"
  >("showcase");
  const [verify, setverify] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const apiurl = "http://localhost:3000/";

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const toSentenceCase = (str: string) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) =>
        word.length ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
      )
      .join(" ");
  };

  const checksession = async () => {
    try {
      if (!user) return;
      const res = await axios.post(`${apiurl}api/auth/onsession`, {
        userid: user.userid,
      });
      if (res.data.session == null) {
        // save the session or user (whatever you want)
        localStorage.removeItem("user");
        navigate("/auth/signin");
      }

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
    checksession();
  }, []);

  const tabs = [
    { name: "showcase", icon: <FaImages />, label: "Showcase" },
    { name: "cart", icon: <FaBoxOpen />, label: "Cart" },
    { name: "follow", icon: <FaUserFriends />, label: "Follow" },
    { name: "likes", icon: <FaHeart />, label: "Likes" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-20 sm:hidden">
        <button
          className="text-emerald-700 text-2xl"
          onClick={() => setPanelOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* MAIN LAYOUT (Flex) */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR (Desktop Fixed) */}
        <aside className="hidden sm:flex w-72 bg-white shadow-md p-6 flex-col overflow-y-auto">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <img
                src={`${apiurl}uploads/avatars/${user.avatar}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-emerald-600"
              />
              {(verify === "VERIFIED" || verify === "FULLY VERIFIED") && (
                <span className="absolute bottom-0 right-0 bg-white text-emerald-600 rounded-full p-1">
                  <FaCheckCircle />
                </span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-bold text-gray-800 text-center">
              {toSentenceCase(
                user ? `${user.firstname} ${user.lastname}` : "Guest"
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {verify === "VERIFIED"
                ? "Verified"
                : verify === "FULLY VERIFIED"
                ? "Fully Verified"
                : ""}
            </p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Campus: MCC
            </p>
          </div>

          <nav className="flex flex-col mt-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name as any)}
                className={`flex items-center gap-3 py-2 px-4 rounded-md text-left transition-all duration-200 ${
                  activeTab === tab.name
                    ? "bg-emerald-700 text-white"
                    : "text-gray-700 hover:bg-emerald-100"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6">
          <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="hover:underline flex items-center gap-1"
            >
              <FaArrowLeft /> Back
            </button>
          </nav>
          <div className="bg-white rounded-xl shadow-md p-1 h-auto">
            {activeTab === "showcase" && <Showcase />}
            {activeTab === "cart" && <Cart />}
            {activeTab === "follow" && <Follow />}
            {activeTab === "likes" && <Likes />}
          </div>
        </main>
      </div>

      {/* MOBILE PANEL */}
      {panelOpen && (
        <aside className="fixed inset-0 bg-white z-50 p-6 flex flex-col sm:hidden shadow-lg overflow-y-auto animate-fadeIn">
          <button
            className="self-end text-2xl text-emerald-700 mb-4"
            onClick={() => setPanelOpen(false)}
          >
            <FaTimes />
          </button>

          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <img
                src={`${apiurl}${user ? user.avatar.replace(/\\/g, "/") : ""}`}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-emerald-600"
              />
              {(verify === "VERIFIED" || verify === "FULLY VERIFIED") && (
                <span className="absolute bottom-0 right-0 bg-white text-emerald-600 rounded-full p-1">
                  <FaCheckCircle />
                </span>
              )}
            </div>

            <h2 className="mt-2 text-xl font-bold text-gray-800 text-center">
              {toSentenceCase(
                user ? `${user.firstname} ${user.lastname}` : "Guest"
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {verify === "VERIFIED"
                ? "Verified"
                : verify === "FULLY VERIFIED"
                ? "Fully Verified"
                : "Not Verified"}
            </p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Campus: MCC
            </p>
          </div>

          <nav className="flex flex-col mt-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name as any);
                  setPanelOpen(false);
                }}
                className={`flex items-center gap-3 py-2 px-4 rounded-md text-left transition-all duration-200 ${
                  activeTab === tab.name
                    ? "bg-emerald-700 text-white"
                    : "text-gray-700 hover:bg-emerald-100"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
