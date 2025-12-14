import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddAddressModal from "./modal/addaddress";
import { FaPlus } from "react-icons/fa";

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

export default function MyAddresses() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  // Get user from localStorage
  let user: User | null = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid user data in localStorage", err);
      user = null;
    }
  }

  const fetchAddresses = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/addresses/address",
        { userid: user?.userid }
      );
      const addr = res.data.address || [];
      setAddresses(addr);

      // Auto-select first if nothing selected
      if (addr.length > 0 && !selectedAddress) {
        setSelectedAddress(addr[0].addressid);
      }
    } catch (err) {
      console.log("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        / <span className="text-gray-700 font-medium">My Addresses</span>
      </nav>

      {/* Edit / Add buttons */}
      <div className="flex justify-between mb-4 items-center">
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
        >
          {editMode ? "Done" : "Edit / Select"}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-1"
        >
          <FaPlus /> Add Address
        </button>
      </div>

      {/* Addresses List */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses</p>
        ) : (
          addresses.map((addr) => (
            <label
              key={addr.addressid}
              className={`flex justify-between items-center border p-4 rounded-lg cursor-pointer transition
                ${selectedAddress === addr.addressid ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="text-gray-700">
                <p className="font-medium">{addr.street}, {addr.barangay}</p>
                <p className="text-gray-500 text-sm">{addr.municipality}, {addr.state}, {addr.country}</p>
                <p className="text-gray-400 text-sm">Status: {addr.status}</p>
              </div>

              {editMode && (
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.addressid}
                  checked={selectedAddress === addr.addressid}
                  onChange={() => setSelectedAddress(addr.addressid)}
                  className="h-5 w-5 text-emerald-600 accent-emerald-600"
                />
              )}
            </label>
          ))
        )}
      </div>

      {/* Modal */}
      {open && (
        <AddAddressModal
          onClose={() => setOpen(false)}
          userid={user?.userid}
          onSuccess={fetchAddresses}
        />
      )}
    </div>
  );
}
