import { Link, Outlet } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import Marketplace from "../../users/marketplace/marketplace";
import { useState } from "react";

export default function Marketplace_Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md p-4 flex items-center gap-4 sticky top-0 z-30">
        <h1 className="text-lg font-bold flex-1 text-center text-emerald-700">
          Marketplace
        </h1>

        {/* Desktop Profile */}
        <Link
          to="/myprofile"
          className="hidden sm:block text-emerald-700 text-xl hover:text-emerald-900 transition-transform duration-200 hover:scale-110"
        >
          <FaUser />
        </Link>

        {/* Mobile Menu Icon */}
        <button
          className="sm:hidden text-emerald-700 text-xl transition-transform duration-200 hover:scale-110 hover:text-emerald-900"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* FULL SCREEN MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col p-6 animate-fadeIn">
          <button
            className="text-emerald-700 text-2xl self-end mb-6 transition-transform duration-200 hover:scale-110 hover:text-emerald-900"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </button>

          <div className="flex flex-col space-y-6 text-lg font-semibold">
            <Link
              to="/profile"
              className="text-emerald-700 transition-all duration-200 hover:text-emerald-900 hover:translate-x-1"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            <Link
              to="/"
              className="text-emerald-700 transition-all duration-200 hover:text-emerald-900 hover:translate-x-1"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </div>
        </div>
      )}

      {/* CONTENT SECTION */}
      <div className="p-4 flex-1">
        <Outlet/>
      </div>

      {/* FOOTER (Shopee Web Style) */}
      <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* CUSTOMER SERVICE */}
          <div>
            <h2 className="font-bold text-gray-100 mb-3">Customer Service</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                How to Buy
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Shipping
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Returns & Refunds
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Contact Support
              </li>
            </ul>
          </div>

          {/* ABOUT */}
          <div>
            <h2 className="font-bold text-gray-100 mb-3">About Us</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer">
                About Marketplace
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">Careers</li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* PAYMENT */}
          <div>
            <h2 className="font-bold text-gray-100 mb-3">Payment</h2>
            <ul className="space-y-2 text-sm">
              <li>GCash</li>
              <li>PayMaya</li>
              <li>Cash on Delivery</li>
              <li>Bank Transfer</li>
            </ul>
          </div>

          {/* FOLLOW */}
          <div>
            <h2 className="font-bold text-gray-100 mb-3">Follow Us</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer">
                Facebook
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Instagram
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">TikTok</li>
              <li className="hover:text-emerald-400 cursor-pointer">YouTube</li>
            </ul>
          </div>

          {/* DOWNLOAD */}
          <div>
            <h2 className="font-bold text-gray-100 mb-3">Download App</h2>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-800 p-3 rounded-lg text-center cursor-pointer hover:bg-gray-700">
                Android
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center cursor-pointer hover:bg-gray-700">
                iOS
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-gray-400 text-xs mt-10 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} Marketplace — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
