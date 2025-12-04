import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    avatar: "",
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    birthday: "",
    email: "",
    password: "",
    schoolid: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Call your API to register user here
  };

  useEffect(() => {
    document.title = "Create account"
  }, [])

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h2 className="text-center text-2xl font-bold text-emerald-700 mb-6 tracking-wide">
          Create Account
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="text-gray-600 text-sm">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="Enter first name"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="text-gray-600 text-sm">Middle Name</label>
            <input
              type="text"
              name="middlename"
              placeholder="Enter middle name"
              value={formData.middlename}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-gray-600 text-sm">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Enter last name"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-gray-600 text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Birthday */}
          <div>
            <label className="text-gray-600 text-sm">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Email */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Password */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* School ID */}
          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-600 text-sm">School ID (Optional)</label>
            <input
              type="text"
              name="schoolid"
              placeholder="Enter school ID"
              value={formData.schoolid}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Submit button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm transition"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
