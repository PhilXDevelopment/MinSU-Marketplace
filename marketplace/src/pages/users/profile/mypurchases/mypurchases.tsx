import axios from "axios";
import { useEffect } from "react"

export default function MyPurchases(){
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const apiUrl="http://localhost:3000/"

    const fetproducts=async()=>{
        try {
            const res=await axios.post(`${apiUrl}api/order/mypurchases`,{userid:user.userid})
            console.log(res.data)
            
        } catch (error) {
            console.error(error)
        }

    }
    useEffect(()=>{
        fetproducts()
    },[user.userid])
    return(
        <div className="">
            purchases
        </div>
    )
};