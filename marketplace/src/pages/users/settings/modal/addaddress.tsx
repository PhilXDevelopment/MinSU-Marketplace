import axios from "axios";
import { useState } from "react";

export default function AddAddressModal({ onClose, userid, onSuccess }) {
  const [form, setForm] = useState({
    street: "",
    barangay: "",
    municipality: "",
    state: "",
    country: "",
    status: "default",
  });
  const [errors, setErrors] = useState({});
  const apiurl = "http://localhost:3000/";

  const validate = () => {
    let e = {};
    if (!form.street) e.street = "Required";
    if (!form.barangay) e.barangay = "Required";
    if (!form.municipality) e.municipality = "Required";
    if (!form.state) e.state = "Required";
    if (!form.country) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await axios.post(`${apiurl}api/addresses/add`, { userid, ...form });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log("Error adding address:", err);
      alert("Failed to add address. Make sure backend is running.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Add Address</h2>
        <div className="grid grid-cols-2 gap-4">
          <InputHalf
            label="Street"
            name="street"
            value={form.street}
            onChange={handleChange}
            error={errors.street}
          />
          <InputHalf
            label="Barangay"
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            error={errors.barangay}
          />
          <InputHalf
            label="Municipality"
            name="municipality"
            value={form.municipality}
            onChange={handleChange}
            error={errors.municipality}
          />
          <InputHalf
            label="State / Province"
            name="state"
            value={form.state}
            onChange={handleChange}
            error={errors.state}
          />
          <InputHalf
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            error={errors.country}
          />
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="default">Set as default</option>
              <option value="permanent">Permanent address</option>
              <option value="work">Work address</option>
              <option value="home">Home address</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function InputHalf({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded-lg"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
