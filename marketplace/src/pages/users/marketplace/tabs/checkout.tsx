import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "../../../../socketcontext";

interface User {
  firstname: string;
  lastname: string;
  avatar: string;
  userid: string;
}

interface Address {
  addressid: string;
  street: string;
  barangay: string;
  municipality: string;
  state: string;
  country: string;
  status: string;
}

interface Product {
  productid: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { id } = useParams();
  const apiUrl = "http://localhost:3000/";

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  let user: User | null = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  const formatPeso = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${apiUrl}api/addresses/address`, {
        userid: user.userid,
      });
      const addr = res.data.address || [];
      setAddresses(addr);
      if (addr.length > 0) setSelectedAddress(addr[0].addressid);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const res = await axios.post(`${apiUrl}api/user-product/viewproduct`, {
        productid: id,
      });
      const prod = res.data.product;
      const firstImage =
        prod.images && prod.images.length > 0 ? prod.images[0] : "";

      setProduct({
        productid: prod.productid,
        name: prod.name,
        image: `${apiUrl}uploads/product_images/${firstImage.split("/").pop()}`,
        price: Number(prod.price),
        quantity: 1,
      });
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchProduct();
  }, []);

  useEffect(() => {
    document.title = "Marketplace | Checkout";
    fetchAddresses();
    fetchProduct();
    const refreshcheckout = () => {
      fetchAddresses();
      fetchProduct();
    };
    if (!socket) return;
    socket.on("product_update", refreshcheckout);
    return () => {
      socket.off("product_update");
    };
  }, [socket]);

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      setErrors("Please select a shipping address.");
      return;
    }
    if (!paymentMethod) {
      setErrors("Please select a payment method.");
      return;
    }
    if (!product) {
      setErrors("Product not loaded.");
      return;
    }

    // Find the selected address object
    const addr = addresses.find((a) => a.addressid === selectedAddress);
    if (!addr) {
      setErrors("Invalid address selected.");
      return;
    }

    // Concatenate full address
    const fullAddress = `${addr.street}, ${addr.barangay}, ${addr.municipality}, ${addr.state}, ${addr.country}`;

    setLoading(true);

    try {
      await axios.post(`${apiUrl}api/order/create`, {
        productid: product.productid,
        buyerid: user?.userid,
        addressid: addr.addressid, // save full address string
        description: description,
        payment_method: paymentMethod,
        quantity: product.quantity,
        total_amount: product.price * product.quantity,
      });

      toast.success("Order submitted successfully!");
      setLoading(false);
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit order.");
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      <nav className="text-gray-500 mb-4 flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate(-1)}
          className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>
        / <span className="text-gray-700 font-medium">Checkout</span>
      </nav>

      {/* Product Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-5 flex gap-4 items-center hover:shadow-lg transition-shadow">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1 space-y-2">
          <h3 className="text-gray-700 font-semibold text-lg">
            {product.name}
          </h3>
          <p className="text-gray-500">
            Unit Price: {formatPeso(product.price)}
          </p>

          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() =>
                setProduct((prev) =>
                  prev
                    ? { ...prev, quantity: Math.max(1, prev.quantity - 1) }
                    : prev
                )
              }
              className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
            >
              −
            </button>
            <span className="text-gray-700 font-medium">
              {product.quantity}
            </span>
            <button
              onClick={() =>
                setProduct((prev) =>
                  prev ? { ...prev, quantity: prev.quantity + 1 } : prev
                )
              }
              className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>

          <p className="text-emerald-600 font-bold mt-1 text-lg">
            Total: {formatPeso(product.price * product.quantity)}
          </p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-5 mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-700 font-semibold text-lg">
            Shipping Address
          </h2>
          <button
            onClick={() => navigate("/settings/addresses")}
            className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 transition"
          >
            <FaPlus /> Change / Add
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr.addressid}
                className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition 
                  ${
                    selectedAddress === addr.addressid
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="text-gray-700">
                  <p className="font-medium">
                    {addr.street}, {addr.barangay}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {addr.municipality}, {addr.state}, {addr.country}
                  </p>
                </div>
                <input
                  type="radio"
                  name="shippingAddress"
                  value={addr.addressid}
                  checked={selectedAddress === addr.addressid}
                  onChange={() => setSelectedAddress(addr.addressid)}
                  className="h-5 w-5 text-emerald-600 accent-emerald-600"
                />
              </label>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            <p>No address found</p>
            <button
              onClick={() => navigate("/settings/addresses")}
              className="text-emerald-600 flex items-center gap-1 mt-2 font-medium"
            >
              <FaPlus /> Add Address
            </button>
          </div>
        )}
      </div>

      {/* Payment & Notes */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-5 mt-6 space-y-3">
        <h2 className="text-gray-700 font-semibold text-lg">Payment & Notes</h2>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-emerald-100 text-gray-700"
        >
          <option value="">Select Payment Method</option>
          <option value="cash on delivery">Cash on delivery</option>
        </select>

        <textarea
          placeholder="Add a note or special instructions"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-emerald-100 text-gray-700"
        />

        {errors && <p className="text-red-500">{errors}</p>}

        <button
          onClick={handleSubmitOrder}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </div>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
}
