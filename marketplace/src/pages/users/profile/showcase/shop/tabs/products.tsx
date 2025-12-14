import { useEffect, useState } from "react";
import AddProduct from "./modal/addproduct";
import axios from "axios";
import ProductData from "./tabs/productdata";

// User & Product interfaces
interface User {
  firstname: string;
  lastname: string;
  avatar: string;
  userid: string;
}

interface Product {
  productid: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  valid_from: string;
  valid_to: string;
  status: string;
  category: string;
  images: string[];
}

// Helper functions
const toSentenceCase = (str: string) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) =>
      word.length ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
};

const toWordDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MyProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const apiUrl = "http://localhost:3000/";

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user)
    return (
      <div className="p-4 text-center text-red-600 font-semibold">
        ⚠ No user found. Please log in again.
      </div>
    );

  // Fetch products
  const displayProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}api/user-product/showproduct`, {
        userid: user.userid,
      });
      if (res.data.products) {
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
    displayProducts();
  }, []);

  // Prepare filter options
  const categories = Array.from(
    new Set(products.map((p) => toSentenceCase(p.category)))
  );
  const statuses = Array.from(
    new Set(products.map((p) => toSentenceCase(p.status)))
  );

  // Filtered products
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter((p) =>
      categoryFilter === "All"
        ? true
        : p.category.toLowerCase() === categoryFilter.toLowerCase()
    )
    .filter((p) =>
      statusFilter === "All"
        ? true
        : p.status.toLowerCase() === statusFilter.toLowerCase()
    )
    .filter(
      (p) =>
        (minPrice === "" || p.price >= minPrice) &&
        (maxPrice === "" || p.price <= maxPrice)
    );

  // If a product is selected, show ProductData tab
  if (selectedProduct) {
    return (
      <ProductData
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productid={selectedProduct.productid}
        apiUrl={apiUrl}
      />
    );
  }

  return (
    <div className="p-4">
      {/* Add Product Button & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2 flex-wrap">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg font-semibold shadow transition text-sm"
        >
          Add Product
        </button>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-28"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-24"
          >
            <option value="All">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-20"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-20"
          />
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <AddProduct
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            displayProducts();
          }}
          apiUrl={apiUrl}
          userId={user.userid}
        />
      )}

      {/* Products Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow">
        {loading ? (
          <p className="p-4 text-center">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-4 text-center">No products found.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                {[
                  "Picture",
                  "Name",
                  "Price",
                  "Quantity",
                  "Category",
                  "Status",
                  "Valid",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r last:border-r-0 border-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.productid}
                  onClick={() => setSelectedProduct(product)}
                  className={`cursor-pointer hover:bg-gray-400 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-2 border-r border-gray-300">
                    {product.images.length > 0 ? (
                      <img
                        src={`${apiUrl}uploads/product_images/${product.images[0]}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {toSentenceCase(product.name)}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    ${product.price}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {toSentenceCase(product.category)}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        product.status.toLowerCase() === "active"
                          ? "bg-green-600"
                          : "bg-gray-600"
                      }`}
                    >
                      {toSentenceCase(product.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {toWordDate(product.valid_from)} →{" "}
                    {toWordDate(product.valid_to)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
