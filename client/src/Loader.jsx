import React from "react";
export default function Loader(){
    return(
        <div className="h-[100vh] w-full flex justify-center items-center fixed inset-0 z-50 ">
            <div className="text-center animate-bounce ">
                <p className="text-3xl font-bold text-yellow-500">Mindoro State University</p>
                <p className="text-5xl font-bold  text-emerald-700">Marketplace</p>
            </div>
        </div>
    )
}