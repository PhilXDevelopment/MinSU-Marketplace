import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();

  // Example cart data
  const cartItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 599,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 899,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
  ];

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-4 pb-14 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        / <span className="text-gray-700 font-medium">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping & Payment Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-emerald-700">Shipping Info</h2>
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={shippingInfo.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-emerald-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-emerald-400"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-emerald-400"
            />
            <div className="flex gap-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-emerald-400"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={shippingInfo.postalCode}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-emerald-400"
              />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl p-2 focus:outline-emerald-400"
            />
          </div>

          <h2 className="text-2xl font-bold text-emerald-700 mt-6">
            Payment Method
          </h2>
          <div className="space-y-2 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="credit-card"
                checked={paymentMethod === "credit-card"}
                onChange={() => setPaymentMethod("credit-card")}
                className="accent-emerald-500"
              />
              Credit Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="accent-emerald-500"
              />
              PayPal
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-4">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">
            Order Summary
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-emerald-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-emerald-700">
                  ₱{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4 border-gray-200">
            <span>Total:</span>
            <span>₱{totalPrice}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition active:scale-95"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
