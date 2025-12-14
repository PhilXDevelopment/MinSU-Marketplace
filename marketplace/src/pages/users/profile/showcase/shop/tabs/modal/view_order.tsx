import axios from "axios";
import { FaTimes, FaPrint } from "react-icons/fa";

interface ViewOrderProps {
  isOpen: boolean;
  onClose: () => void;
  orderdata: any; // should include buyer and address info
  apiUrl: string;
}

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

export default function ViewOrder({
  isOpen,
  onClose,
  orderdata,
  apiUrl,
}: ViewOrderProps) {
  if (!isOpen || !orderdata) return null;

  const currentStatus =
    orderdata.order_stats?.[orderdata.order_stats.length - 1]?.status;

  const updateStatus = async (status: string) => {
    await axios.post(`${apiUrl}api/user-product/approved-bulk-orders`, {
      orders: [orderdata.orderid],
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="font-semibold text-lg">Order Details</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* ORDER INFO */}
        <div className="text-sm space-y-2">
          <p>
            <b>Ref No:</b> {orderdata.ref_no}
          </p>
          <p>
            <b>Quantity:</b> {orderdata.quantity}
          </p>
          <p>
            <b>Total:</b> ₱{Number(orderdata.total_amount).toLocaleString()}
          </p>
          <p>
            <b>Payment:</b> {orderdata.payment_method}
          </p>
          <p>
            <b>Status:</b> <span className="font-bold">{currentStatus}</span>
          </p>

          {/* BUYER INFO */}
          {orderdata.buyer && (
            <div className="mt-2 border-t pt-2 flex gap-3">
              {orderdata.buyer.avatar && (
                <img
                  src={`${apiUrl}${orderdata.buyer.avatar}`}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold">Buyer Details</h3>
                <p>
                  <b>Name:</b> {orderdata.buyer.firstname}{" "}
                  {orderdata.buyer.lastname}
                </p>
                <p>
                  <b>Email:</b> {orderdata.buyer.email}
                </p>
                <p>
                  <b>Shipping Address:</b> {orderdata.address}
                </p>
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
}
