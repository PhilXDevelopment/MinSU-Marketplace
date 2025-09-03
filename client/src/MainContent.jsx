import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer, toast } from 'react-toastify';
export default function MainContent(){
    const [hasMessage,setHasMessage]=useState(false)


    return(
        <div className="">
            <div className="fixed w-full">
                <Header/>
      <ToastContainer />


            </div>
            <div className="h-[100vh] w-full pt-[100px] bg-blue-100">
             
                 <Outlet/>
            </div>
              <div className="">
                <Footer/>
            </div>
        </div>
    )
}