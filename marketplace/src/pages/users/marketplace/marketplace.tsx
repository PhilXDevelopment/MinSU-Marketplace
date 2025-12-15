import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Product {
  productid: string;
  name: string;
  description?: string;
  price: number;
  rating?: number;
  category: string;
  images?: string[];
  in_cart?: number;
}
interface User {
  firstname: string;
  lastname: string;
  avatar: string;
  userid: string;
}

export default function Marketplace() {
  const location = useLocation();
  const isMarketplacePage = location.pathname === "/marketplace";

  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle
  const navigate = useNavigate();

  const apiUrl = "http://localhost:3000/";

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}api/user-product/publicdisplay`, {
        userid: user?.userid,
      });

      if (res.data && res.data.products) {
        const formattedProducts = res.data.products.map((p: any) => ({
          ...p,
          images: p.images
            ? Array.isArray(p.images)
              ? p.images
              : [p.images]
            : [],
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Marketplace";
    fetchProducts();
  }, []);

  // Add to cart
  const addToCart = async (productid: string) => {
    if (!user) {
      navigate("/auth/signin");
      return;
    }
    try {
      const res = await axios.post(`${apiUrl}api/user-product/addtocart`, {
        productid,
        userid: user.userid,
        status: "PENDING",
      });
      if (res.status === 200) {
        toast.success(res.data?.message || "Added to cart!");
        fetchProducts(); // Refresh products to update in_cart status
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  // Filter products
  const filteredProducts = products
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (category === "all" ? true : item.category === category))
    .filter((item) => (minPrice ? item.price >= Number(minPrice) : true))
    .filter((item) => (maxPrice ? item.price <= Number(maxPrice) : true));

  return (
    <div className="pb-14 p-2 sm:p-4 space-y-4">
      {/* Filters + Search */}
      {isMarketplacePage && (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden bg-emerald-600 text-white p-2 rounded-xl mb-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters Panel */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-4`}
          >
            {/* Search input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 border border-emerald-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border border-emerald-200 rounded-xl text-sm sm:text-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home Appliances</option>
                <option value="fashion">Fashion</option>
                <option value="books">Books</option>
              </select>
            </div>

            {/* Price range filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <input
                type="number"
                placeholder="Min ₱"
                className="w-full p-2 border border-emerald-200 rounded-xl text-sm sm:text-base"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max ₱"
                className="w-full p-2 border border-emerald-200 rounded-xl text-sm sm:text-base"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              <p className="text-center text-gray-500 col-span-full">
                Loading products...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                No products found.
              </p>
            ) : (
              filteredProducts.map((item) => (
                <div
                  key={item.productid}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-emerald-100 hover:-translate-y-1"
                >
                  <div className="w-full h-36 sm:h-40 bg-gray-100">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? `${apiUrl}uploads/product_images/${item.images[0]}`
                          : "https://via.placeholder.com/300x300"
                      }
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="p-3 space-y-1">
                    <a
                      href={`/marketplace/product/${item.productid}`}
                      className="text-sm sm:text-base font-medium line-clamp-2"
                    >
                      {item.name}
                    </a>
                    <p className="text-emerald-700 font-bold text-base sm:text-lg">
                      ₱{item.price}
                    </p>
                    <p className="text-xs sm:text-sm text-yellow-500 font-medium">
                      ⭐ {item.rating || "-"}
                    </p>

                    {item.in_cart === 1 ? (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white text-sm sm:text-base py-1.5 rounded-xl cursor-not-allowed"
                      >
                        Added to Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(item.productid)}
                        className="w-full bg-emerald-600 text-white text-sm sm:text-base py-1.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
