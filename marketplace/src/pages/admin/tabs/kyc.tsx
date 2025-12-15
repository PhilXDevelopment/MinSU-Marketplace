import axios from "axios";
import { useEffect, useState } from "react";
import KycModal from "./modal/kycmodal";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // initialize outside the component

export default function AdminKyc() {
  const apiUrl = "http://localhost:3000/";
  const [pending, setPending] = useState([]);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


  interface User {
    firstname: string;
    lastname: string;
    avatar: string;
    userid: string;
  }
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



  const displayKyc = async () => {
    try {
      const res = await axios.post(`${apiUrl}api/kyc/show`);
      setPending(res.data.pending || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Initial load
    displayKyc();

    // Listen for KYC updates
    socket.on("kycUpdated", () => {
      console.log("KYC updated, refreshing table...");
      displayKyc();
    });

    return () => {
      socket.off("kycUpdated"); // cleanup listener
    };
  }, []);

  const openModal = (kyc) => {
    setSelectedKyc(kyc);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedKyc(null);
    setIsOpen(false);
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        KYC Approval Board
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-100">
              <th>#</th>
              <th>Type</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pending.length > 0 ? (
              pending.map((p, index) => (
                <tr
                  key={p.kycid}
                  className="bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => openModal(p)}
                >
                  <td>{index + 1}</td>
                  <td className="text-blue-700 font-medium">{p.usertype}</td>
                  <td>{p.firstname}</td>
                  <td>{p.middlename}</td>
                  <td>{p.lastname}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        p.status === "PENDING"
                          ? "bg-yellow-200 text-yellow-800"
                          : p.status === "APPROVED"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-400 font-medium"
                >
                  No pending KYC found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedKyc && (
        <KycModal
          isOpen={isOpen}
          onClose={closeModal}
          kyc={selectedKyc}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
}
