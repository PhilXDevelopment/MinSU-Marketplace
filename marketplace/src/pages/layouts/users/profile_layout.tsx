import { useState } from "react";
import {
  FaBoxOpen,
  FaHeart,
  FaUserFriends,
  FaImages,
  FaArrowLeft,
} from "react-icons/fa";
import Showcase from "../../users/profile/showcase/showcase";
import "../../../App.css";
import Cart from "../../users/profile/cart/cart";
import Follow from "../../users/profile/follow/Follow";
import Likes from "../../users/profile/likes/likes";
import { useNavigate } from "react-router-dom";

export default function Profile_Layout() {

    const navigate=useNavigate();
  const [activeTab, setActiveTab] = useState<
    "showcase" | "cart" | "follow" | "likes"
  >("showcase");

  const tabs = [
    { name: "showcase", icon: <FaImages />, label: "Showcase" },
    { name: "cart", icon: <FaBoxOpen />, label: "Cart" },
    { name: "follow", icon: <FaUserFriends />, label: "Follow" },
    { name: "likes", icon: <FaHeart />, label: "Likes" },
  ];

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center gap-3 p-4 bg-white shadow-md sticky top-0 z-20">
        <button onClick={()=>navigate('/marketplace')} className="text-emerald-700 text-xl">
          <FaArrowLeft />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center p-6 bg-emerald-700 text-white shadow-md">
        <img
          src="https://via.placeholder.com/120"
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-white mb-4"
        />
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-sm">Campus: MCC</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-around bg-white shadow-md sticky top-[72px] z-10">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name as any)}
            className={`flex flex-col items-center py-3 w-full transition-colors duration-200
              ${
                activeTab === tab.name
                  ? "text-white bg-emerald-700 font-semibold"
                  : "text-gray-700 hover:bg-emerald-100"
              }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-sm mt-1">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "showcase" && <Showcase />}
        {activeTab === "cart" && <Cart/>}
        {activeTab === "follow" &&<Follow/>}
        {activeTab === "likes" && <Likes/>}
      </div>
    </div>
  );
}
