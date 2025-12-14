import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";

interface User {
  userid: string;
  firstname: string;
  lastname: string;
  avatar: string;
  rating?: number; // average rating
}

interface Product {
  productid: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  images: { image: string }[];
}

// Utility function to convert text to sentence case
const toSentenceCase = (text: string | undefined | null): string => {
  if (!text) return "";
  text = text.trim();
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export default function StorePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // seller userid

  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const apiUrl = "http://localhost:3000/";

  const displayStoreData = async () => {
    try {
      const res = await axios.post(`${apiUrl}api/user-product/store`, {
        userid: id,
      });

      if (res.data.user) {
        setSeller(res.data.user);
      }

      const productList = res.data.products || [];
      setProducts(productList);
      setFiltered(productList);

      const uniqueCategories = [
        ...new Set(productList.map((p: Product) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching store data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    displayStoreData();
  }, [id]);

  const filterCategory = (category: string) => {
    setActiveCategory(category);
    setFiltered(
      category === "All"
        ? products
        : products.filter((p) => p.category === category)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading store...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-4 pb-14 space-y-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        / <span className="text-gray-700 font-medium">Store</span>
      </nav>

      {/* Seller Profile */}
      {seller ? (
        <div className="relative bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={`${apiUrl}${seller.avatar}`}
            alt={toSentenceCase(seller.firstname)}
            className="w-20 h-20 rounded-full border-2 border-emerald-400"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-emerald-700">
              {toSentenceCase(seller.firstname)}{" "}
              {toSentenceCase(seller.lastname)}
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Seller ID: {seller.userid}
            </p>
            {/* Review Rating */}
            {seller.rating && (
              <p className="text-sm text-yellow-500 mt-1">
                ⭐ {seller.rating.toFixed(1)}
              </p>
            )}
          </div>

          {/* 3 Dots Store Options */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <FiMoreVertical size={20} />
          </button>
          {showOptions && (
            <div className="absolute right-4 top-12 bg-white shadow-lg border rounded-md p-2 z-50 w-40">
              <button className="text-sm w-full text-left py-1 hover:bg-gray-100 px-2 rounded">
                Report Store
              </button>
              <button className="text-sm w-full text-left py-1 hover:bg-gray-100 px-2 rounded">
                Follow Seller
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-red-500">Seller not found.</p>
      )}

      {/* Category Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => filterCategory("All")}
          className={`px-4 py-1.5 rounded-full border text-sm ${
            activeCategory === "All"
              ? "bg-emerald-600 text-white"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => filterCategory(category)}
            className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap ${
              activeCategory === category
                ? "bg-emerald-600 text-white"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            {toSentenceCase(category)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.productid}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-emerald-100 hover:-translate-y-1"
          >
            <div className="w-full h-40 bg-gray-100">
              <img
                src={`${apiUrl}uploads/product_images/${
                  item.images?.[0]?.image || "/no-image.png"
                }`}
                alt={toSentenceCase(item.name)}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-3 space-y-1">
              <p className="text-sm font-medium line-clamp-2">
                {toSentenceCase(item.name)}
              </p>
              <p className="text-gray-500 text-xs">Quantity: {item.quantity}</p>
              <p className="text-emerald-700 font-bold text-lg">
                ₱{item.price}
              </p>
              <button className="w-full bg-emerald-600 text-white text-sm py-1.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Products */}
      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-6">
          No products found for this category.
        </p>
      )}
    </div>
  );
}
