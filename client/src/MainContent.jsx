import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AlertMessage from  "./MessageAlert";
export default function MainContent(){
    return(
        <div className="">
            <div className="fixed w-full">
                <Header/>
            </div>
            <div className="h-[100vh] w-full pt-[100px] bg-blue-100">
                <AlertMessage/>
                 <Outlet/>
            </div>
              <div className="">
                <Footer/>
            </div>
        </div>
    )
}