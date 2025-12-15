import { useEffect } from "react";
import { useSocket } from "../../../../../../socketcontext";

export default function MyDashboard() {
  const socket = useSocket();

  useEffect(() => {
    document.title = "Marketplace | Profile | Dashboard";

    const refreshproducts = () => {};
    if (!socket) return;
    socket.on("product_update", refreshproducts);
    return () => {
      socket.off("product_update");
    };
  }, [socket]);
  return <div className="">Dashboard</div>;
}
