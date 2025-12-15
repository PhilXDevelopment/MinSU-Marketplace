import axios from "axios";
import { useEffect, useState } from "react"
import { MdPendingActions } from "react-icons/md";
import { MdOutlinePayment } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdIncompleteCircle } from "react-icons/md";
import { VscServerProcess } from "react-icons/vsc";
import { useSocket } from "../../../../socketcontext";

export default function MyPurchases() {
  const socket = useSocket();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [activetab, setactivetab] = useState("PENDING");
  const [purchases, setpurchases] = useState({});

  const apiUrl = "http://localhost:3000/";

  const fetproducts = async () => {
    try {
      const res = await axios.post(`${apiUrl}api/order/mypurchases`, {
        userid: user.userid,
      });
      console.log(res.data);
      setpurchases(res.data.purchases);
      // console.log(purchases)
    } catch (error) {
      console.error(error);
    }
  };
  const formatPeso = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  useEffect(() => {
    document.title = "Marketplace | Checkout";
    fetproducts();
    const refreshcheckout = () => {
      fetproducts();
    };
    if (!socket) return;
    socket.on("product_update", refreshcheckout);
    return () => {
      socket.off("product_update");
    };
  }, [socket]);
  return (
    <div className="text-gray-600">
      <div className="flex gap-3">
        <button
          onClick={() => {
            setactivetab("PENDING");
          }}
          className={`text-center ${
            activetab == "PENDING" ? `p-2 bg-blue-500  text-white` : ` p-2`
          }`}
        >
          <MdPendingActions className="text-3xl" />
          Pending
        </button>
        <button
          onClick={() => {
            setactivetab("APPROVED");
          }}
          className={`text-center ${
            activetab == "APPROVED" ? `p-2 bg-blue-500  text-white` : ` p-2`
          }`}
        >
          <MdOutlinePayment className="text-3xl" />
          To Pay
        </button>
        <button
          onClick={() => {
            setactivetab("PROCESSING");
          }}
          className={`text-center ${
            activetab == "PROCESSING" ? `p-2 bg-blue-500  text-white` : ` p-2`
          }`}
        >
          <VscServerProcess className="text-3xl" />
          Processing
        </button>
        <button
          onClick={() => {
            setactivetab("FOR DELIVERY");
          }}
          className={`text-center ${
            activetab == "FOR DELIVERY" ? `p-2 bg-blue-500  text-white` : ` p-2`
          }`}
        >
          <CiDeliveryTruck className="text-3xl" />
          For Delivery
        </button>
        <button
          onClick={() => {
            setactivetab("COMPLETED");
          }}
          className={`text-center ${
            activetab == "COMPLETED" ? `p-2 bg-blue-500  text-white` : ` p-2`
          }`}
        >
          <MdIncompleteCircle className="text-3xl" />
          Completed
        </button>
      </div>

      {/* Content  */}
      <div className="pt-3">
        {Array.isArray(purchases) &&
          purchases.map(
            (order, index) =>
              order.order_status == activetab && (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-3">
                    <img
                      src={`${apiUrl}uploads/product_images/${order.product_images[0]}`}
                      className="h-16"
                    />
                    <div className="">
                      <p className="font-semibold">{order.product_name}</p>
                      <p className="font-semibold">x{order.quantity}</p>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-sm font-semibold">Total</p>
                    <p className="font-bold">
                      {formatPeso(order.total_amount)}
                    </p>
                  </div>
                </div>
              )
          )}
      </div>
    </div>
  );
};