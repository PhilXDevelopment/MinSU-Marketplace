import { useState } from "react";
import { FaTachometerAlt, FaBoxOpen } from "react-icons/fa";
import MyDashboard from "./tabs/dashboard";
import MyProducts from "./tabs/products";

export default function MyShop() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "products", label: "Products", icon: <FaBoxOpen /> },
  ];

  return (
    <div className="bg-white rounded-xl p-6">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors
              ${
                activeTab === tab.id
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600 hover:bg-gray-100"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="">
        {activeTab === "dashboard" && <MyDashboard />}
        {activeTab === "products" && <MyProducts />}
      </div>
    </div>
  );
}
