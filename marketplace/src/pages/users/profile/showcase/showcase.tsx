import { useEffect, useState } from "react";
import MyShop from "./shop/myshop";
import MyPurchases from "../mypurchases/mypurchases";
import { HiOutlineIdentification } from "react-icons/hi";
import {
  FaArrowLeft,
  FaStore,
  FaPesoSign,
  FaBoxesStacked,
  FaBagShopping,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type TabType = "showcase" | "shop" | "purchases";

export default function Showcase() {
  const [activeTab, setActiveTab] = useState<TabType>("showcase");
  const [activeButton, setActiveButton] = useState<TabType | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();
  const apiUrl = "http://localhost:3000/";

  const handleKYC = () => navigate("/auth/kyc");

  const showcase = async () => {
    try {
      const res = await axios.post(`${apiUrl}api/user-product/showcase`, {
        userid: user.userid,
      });
      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    showcase();
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setActiveButton(tab);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 px-4 py-3">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {activeTab !== "showcase" ? (
            <button
              onClick={() => handleTabChange("showcase")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
            >
              <FaArrowLeft />
              <span className="text-sm font-medium">Products</span>
            </button>
          ) : (
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
              <FaBoxesStacked className="text-blue-500" />
              Products
            </h2>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* KYC BUTTONS – ONLY ON SHOWCASE */}
          {activeTab === "showcase" && (
            <>
              {user?.kyc_status === "PENDING" && (
                <button
                  disabled
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-500 rounded-lg text-sm"
                >
                  <HiOutlineIdentification />
                  KYC Submitted
                </button>
              )}

              {user?.kyc_status === "DECLINED" && (
                <button
                  onClick={handleKYC}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300"
                >
                  <HiOutlineIdentification />
                  Re-apply KYC
                </button>
              )}

              {user?.verify_status !== "FULLY VERIFIED" &&
                !["PENDING", "DECLINED"].includes(user?.kyc_status) && (
                  <button
                    onClick={handleKYC}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300"
                  >
                    <HiOutlineIdentification />
                    Apply KYC
                  </button>
                )}
            </>
          )}

          {/* MY PURCHASES */}
          {activeTab !== "shop" && (
            <button
              onClick={() => handleTabChange("purchases")}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition
                ${
                  activeButton === "purchases"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
            >
              <FaBagShopping />
              My Purchases
            </button>
          )}

          {/* MY SHOP */}
          {user?.verify_status === "FULLY VERIFIED" && (
            <button
              onClick={() => handleTabChange("shop")}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition
                ${
                  activeButton === "shop"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                }`}
            >
              <FaStore />
              My Shop
            </button>
          )}
        </div>
      </div>

      {/* SHOWCASE GRID */}
      {activeTab === "showcase" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.productid}
              className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <img
                src={`${apiUrl}uploads/product_images/${product.images?.[0]}`}
                alt={product.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-3 space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 truncate">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <FaPesoSign className="text-blue-400" />
                    <span className="font-medium text-slate-700">
                      {Number(product.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaBoxesStacked className="text-emerald-400" />
                    <span>{product.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHOP TAB */}
      {activeTab === "shop" && <MyShop />}

      {/* PURCHASES TAB */}
      {activeTab === "purchases" && <MyPurchases />}
    </div>
  );
}
