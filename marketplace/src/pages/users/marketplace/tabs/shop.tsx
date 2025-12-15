import { useEffect } from "react";
import { useSocket } from "../../../../socketcontext";
export default function Shop() {
  const socket = useSocket();
  useEffect(() => {
    document.title = "Marketplace | Shop";
    const refreshMarketplace = () => {};
    if (!socket) return;
    socket.on("product_update", refreshMarketplace);
    return () => {
      socket.off("product_update");
    };
  }, [socket]);
  return <div className="">shop</div>;
}
