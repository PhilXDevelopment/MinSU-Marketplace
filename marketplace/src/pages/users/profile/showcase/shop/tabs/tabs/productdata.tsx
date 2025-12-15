import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPrint, FaTimes } from "react-icons/fa";
import { useSocket } from "../../../../../../../socketcontext";

interface ProductDataProps {
  isOpen: boolean;
  onClose: () => void;
  productid: string;
  apiUrl: string;
}

interface OrderStatus {
  order_statusid: string;
  status: string;
  created_at: string;
}

interface Buyer {
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
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

interface Order {
  orderid: string;
  ref_no: string;
  payment_method: string;
  quantity: number;
  total_amount: number | string;
  order_stats?: OrderStatus[];
  buyer?: Buyer;
  address?: Address;
}

interface Product {
  name: string;
  images?: string[];
  price?: string | number;
  orders?: Order[];
}

/* ---------------- STATUS MAP ---------------- */
const STATUS_MAP: Record<string, string> = {
  PENDINGS: "PENDING",
  APPROVED: "APPROVED",
  PROCESSING: "PROCESSING",
  FOR_DELIVERY: "FOR_DELIVERY",
  DISPUTES: "DISPUTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function ProductData({
  isOpen,
  onClose,
  productid,
  apiUrl,
}: ProductDataProps) {
  const socket = useSocket();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("PENDINGS");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchProductData = async () => {
    try {
      const res = await axios.post(`${apiUrl}api/user-product/productdata`, {
        productid,
      });
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = "Marketplace | Profile | Shop";
    fetchProductData();
    const refreshproducts = () => {
      fetchProductData();
    };
    if (!socket) return;
    socket.on("product_update", refreshproducts);
    return () => {
      socket.off("product_update");
    };
  }, [socket]);

  useEffect(() => {
    if (isOpen) fetchProductData();
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const orders = product.orders || [];

  /* ---------------- FILTER BY STATUS ---------------- */
  const filteredOrders = orders.filter((o) =>
    (o.order_stats || []).some((s) => s.status === STATUS_MAP[activeTab])
  );

  const countOrdersByTab = (tab: string) =>
    orders.filter((o) =>
      (o.order_stats || []).some((s) => s.status === STATUS_MAP[tab])
    ).length;

  /* ---------------- SELECT LOGIC ---------------- */
  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.orderid));
    }
  };

  /* ---------------- STATUS UPDATE ---------------- */
  const handleBulkUpdateStatus = async (status: string) => {
    try {
      await axios.post(`${apiUrl}api/user-product/approved-bulk-orders`, {
        orders: selectedOrders,
        status,
      });
      setSelectedOrders([]);
      fetchProductData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    alert("Print receipt / QR logic here 👍");
  };

  /* ---------------- TABS ---------------- */
  const tabs = [
    "PENDINGS",
    "APPROVED",
    "PROCESSING",
    "FOR_DELIVERY",
    "DISPUTES",
    "COMPLETED",
    "CANCELLED",
  ];

  const getActionsForTab = (tab: string) => {
    switch (tab) {
      case "PENDINGS":
        return [
          { label: "Approve", status: "APPROVED", color: "bg-emerald-600" },
          { label: "Decline", status: "CANCELLED", color: "bg-red-600" },
        ];
      case "APPROVED":
        return [
          { label: "Process", status: "PROCESSING", color: "bg-blue-600" },
          { label: "Cancel", status: "CANCELLED", color: "bg-red-600" },
        ];
      case "FOR_DELIVERY":
        return [
          { label: "Complete", status: "COMPLETED", color: "bg-emerald-600" },
          { label: "Dispute", status: "DISPUTED", color: "bg-yellow-600" },
        ];
      case "DISPUTES":
        return [
          { label: "Resolve", status: "COMPLETED", color: "bg-emerald-600" },
          { label: "Cancel", status: "CANCELLED", color: "bg-red-600" },
        ];
      default:
        return [];
    }
  };

  /* ---------------- VIEW ORDER ---------------- */
  const handleViewOrder = (order: Order) => {
    setViewOrder(order);
  };

  const closeViewOrder = () => {
    setViewOrder(null);
    fetchProductData();
  };

  /* ---------------- VIEW ORDER MODAL ---------------- */
  const ViewOrderModal = ({ order }: { order: Order }) => {
    const currentStatus =
      order.order_stats?.[order.order_stats.length - 1]?.status || "";

    const updateStatus = async (status: string) => {
      try {
        await axios.post(`${apiUrl}api/user-product/approved-bulk-orders`, {
          orders: [order.orderid],
          status,
        });
        closeViewOrder();
      } catch (err) {
        console.error(err);
      }
    };

    const ACTIONS_BY_STATUS: Record<
      string,
      { label: string; next: string; color: string }[]
    > = {
      PENDING: [
        { label: "Approve", next: "APPROVED", color: "bg-emerald-600" },
        { label: "Decline", next: "CANCELLED", color: "bg-red-600" },
      ],
      APPROVED: [
        { label: "Process", next: "PROCESSING", color: "bg-blue-600" },
        { label: "Cancel", next: "CANCELLED", color: "bg-red-600" },
      ],
      FOR_DELIVERY: [
        { label: "Complete", next: "COMPLETED", color: "bg-emerald-600" },
        { label: "Dispute", next: "DISPUTED", color: "bg-yellow-600" },
      ],
      DISPUTED: [
        { label: "Resolve", next: "COMPLETED", color: "bg-emerald-600" },
        { label: "Cancel", next: "CANCELLED", color: "bg-red-600" },
      ],
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-4">
          {/* HEADER */}
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h2 className="font-semibold text-lg">Order Details</h2>
            <button onClick={closeViewOrder}>
              <FaTimes />
            </button>
          </div>

          {/* ORDER INFO */}
          <div className="text-sm space-y-2">
            <p>
              <b>Ref No:</b> {order.ref_no}
            </p>
            <p>
              <b>Quantity:</b> {order.quantity}
            </p>
            <p>
              <b>Total:</b> ₱{Number(order.total_amount).toLocaleString()}
            </p>
            <p>
              <b>Payment:</b> {order.payment_method}
            </p>
            <p>
              <b>Status:</b> <span className="font-bold">{currentStatus}</span>
            </p>

            {/* BUYER INFO */}
            {order.buyer && (
              <div className="mt-2 border-t pt-2 flex gap-3">
                {order.buyer.avatar && (
                  <img
                    src={`${apiUrl}${order.buyer.avatar}`}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">Buyer Details</h3>
                  <p>
                    <b>Name:</b> {order.buyer.firstname} {order.buyer.lastname}
                  </p>
                  <p>
                    <b>Email:</b> {order.buyer.email}
                  </p>
                  {order.address && (
                    <p>
                      <b>Shipping Address:</b>{" "}
                      {`${order.address.street}, ${order.address.barangay}, ${order.address.municipality}, ${order.address.state}, ${order.address.country}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {ACTIONS_BY_STATUS[currentStatus]?.map((btn) => (
              <button
                key={btn.next}
                onClick={() => updateStatus(btn.next)}
                className={`${btn.color} text-white px-4 py-2 rounded`}
              >
                {btn.label}
              </button>
            ))}

            {!["COMPLETED", "CANCELLED"].includes(currentStatus) && (
              <button className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-1">
                <FaPrint /> Print
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 bg-white rounded shadow-md max-w-6xl mx-auto">
      {/* BACK */}
      <button onClick={onClose} className="flex gap-1 mb-4 text-gray-600">
        <FaArrowLeft /> Back /{" "}
        <span className="text-emerald-600">{product.name}</span>
      </button>

      {/* PRODUCT INFO */}
      <div className="flex gap-4 mb-4">
        {product.images?.[0] && (
          <img
            src={`${apiUrl}uploads/product_images/${product.images[0]}`}
            className="w-24 h-24 rounded border object-cover"
          />
        )}
        <div>
          <h2 className="font-semibold">{product.name}</h2>
          <p className="text-emerald-600 font-bold">
            ₱{Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedOrders([]);
            }}
            className={`px-3 py-1 border rounded text-sm ${
              activeTab === tab
                ? "bg-emerald-100 text-emerald-600 font-bold"
                : "bg-gray-100"
            }`}
          >
            {tab} ({countOrdersByTab(tab)})
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        {filteredOrders.length ? (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2">Ref No</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr
                  key={o.orderid}
                  className="border-t cursor-pointer hover:bg-gray-200"
                  onClick={() => handleViewOrder(o)}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(o.orderid)}
                      onChange={() => toggleSelectOrder(o.orderid)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-2">{o.ref_no}</td>
                  <td className="p-2">{o.quantity}</td>
                  <td className="p-2">
                    ₱{Number(o.total_amount).toLocaleString()}
                  </td>
                  <td className="p-2">{o.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-400 py-6">No orders found</p>
        )}
      </div>

      {/* ACTIONS */}
      {selectedOrders.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {getActionsForTab(activeTab).map((btn) => (
            <button
              key={btn.status}
              onClick={() => handleBulkUpdateStatus(btn.status)}
              className={`${btn.color} text-white px-4 py-2 rounded`}
            >
              {btn.label}
            </button>
          ))}

          {!["COMPLETED", "CANCELLED"].includes(activeTab) && (
            <button
              onClick={handlePrint}
              className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-1"
            >
              <FaPrint /> Print
            </button>
          )}
        </div>
      )}

      {/* VIEW ORDER MODAL */}
      {viewOrder && <ViewOrderModal order={viewOrder} />}
    </div>
  );
}
