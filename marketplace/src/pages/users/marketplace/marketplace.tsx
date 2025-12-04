import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Marketplace() {
  const location = useLocation();
  const isMarketplacePage = location.pathname === "/marketplace";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  const filteredProducts = products
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (category === "all" ? true : item.category === category))
    .filter((item) => (minPrice ? item.price >= minPrice : true))
    .filter((item) => (maxPrice ? item.price <= maxPrice : true))
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  useEffect(() => {
    document.title = "Marketplace"
  }, [])

  return (
    <div className="pb-14">
      {/* 🔍 FILTER BAR ONLY ON MARKETPLACE */}
      {isMarketplacePage && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 mb-4 space-y-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select
              className="p-2 border border-emerald-200 rounded-xl text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home Appliances</option>
              <option value="fashion">Fashion</option>
            </select>

            <select
              className="p-2 border border-emerald-200 rounded-xl text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price_low">Price: Low → High</option>
              <option value="price_high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <input
              type="number"
              placeholder="Min ₱"
              className="p-2 border border-emerald-200 rounded-xl text-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Max ₱"
              className="p-2 border border-emerald-200 rounded-xl text-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 🛒 PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((item) => (
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

      {filteredProducts.length === 0 && (
        <p className="text-center text-sm text-gray-500 mt-6">
          No products found.
        </p>
      )}
    </div>
  );
}
