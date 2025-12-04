import React from "react";
import { useNavigate } from "react-router-dom";

export default function StorePage() {
  const navigate = useNavigate();

  // Example user/seller data
  const user = {
    name: "John Doe",
    avatar: "https://via.placeholder.com/80",
    bio: "Trusted seller with quality electronics",
    location: "Manila, Philippines",
    rating: 4.9,
    reviews: 120,
  };

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 599,
      rating: 4.8,
      category: "electronics",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 2,
      name: "Portable Blender",
      price: 449,
      rating: 4.7,
      category: "home",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 899,
      rating: 4.9,
      category: "electronics",
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: 350,
      rating: 4.6,
      category: "electronics",
      image: "https://via.placeholder.com/300x300",
    },
  ];

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
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full border-2 border-emerald-400"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-emerald-700">{user.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{user.bio}</p>
          <p className="text-gray-500 text-xs mt-1">{user.location}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            <span className="text-yellow-500 font-medium">
              ⭐ {user.rating}
            </span>
            <span className="text-gray-500 text-xs">
              ({user.reviews} reviews)
            </span>
          </div>
        </div>
        <button className="bg-emerald-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-emerald-600 transition mt-3 sm:mt-0">
          Follow
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-emerald-100 hover:-translate-y-1"
          >
            <div className="w-full h-40 bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="p-3 space-y-1">
              <p className="text-sm font-medium line-clamp-2">{item.name}</p>
              <p className="text-emerald-700 font-bold text-lg">
                ₱{item.price}
              </p>
              <p className="text-xs text-yellow-500 font-medium">
                ⭐ {item.rating}
              </p>
              <button className="w-full bg-emerald-600 text-white text-sm py-1.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-6">
          No products available.
        </p>
      )}
    </div>
  );
}
