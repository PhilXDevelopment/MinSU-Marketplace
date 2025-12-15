import axios from "axios";
import { useEffect, useState } from "react"

export default function MyPurchases() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [activetab, setactivetab] = useState("pending")
    const [purchases, setpurchases] = useState({});


    const apiUrl = "http://localhost:3000/"

    const fetproducts = async () => {
        try {
            const res = await axios.post(`${apiUrl}api/order/mypurchases`, { userid: user.userid })
            console.log(res.data)
            setpurchases(res.data.purchases)
            // console.log(purchases)

        } catch (error) {
            console.error(error)
        }

    }
    const order_status = ["PENDING", "APPROVED", "PROCESSING", "FOR DELIVERY"]



    useEffect(() => {
        fetproducts()
        // console.log(purchases)
    }, [user.userid])
    return (
        <div className="">
            <div className="w-full flex flex-col col-5">
                <div className="">
                    {/* Pending Icon */}
                    <button onClick={() => setactivetab("PENDING")} className={activetab == "PENDING" ? "bg-blue-500" : ""}>Pending</button>
                </div>
                <div className="">
                    {/* To pay Icon */}
                    <button onClick={() => setactivetab("APPROVED" || "")} className={activetab == "APPROVED" || "PROCESSING" ? "bg-blue-500" : ""}>To Pay</button>
                </div>
                <div className="">
                    {/* To pay Icon */}
                    <button onClick={() => setactivetab("PENDING")} className={activetab == "FOR DELIVERY" ? "bg-blue-500" : ""}>For Delivery</button>
                </div>
                <div className="">
                    {/* Delivery Icon */}
                    <button onClick={() => setactivetab("PENDING")} className={activetab == "COMPLETED" ? "bg-blue-500" : ""}>For Delivery</button>
                </div>
                <div className="">
                    {/* Cancelled Icon */}
                    <button onClick={() => setactivetab("PENDING")} className={activetab == "CANCELLED" ? "bg-blue-500" : ""}>Cancelled</button>
                </div>
                <div className="">
                    {/* Disputes Icon */}
                    <button onClick={() => setactivetab("PENDING")} className={activetab == "DISPUTES" ? "bg-blue-500" : ""}>Disputes</button>
                </div>
            </div>
            {Array.isArray(purchases) &&
                purchases.map((purchase, index) => (
                    <div key={index}>

                    </div>
                ))
            }

        </div>
    )
};