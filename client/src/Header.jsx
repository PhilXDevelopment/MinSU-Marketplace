import React from "react"
export default function Header(){
    return(
         <div className="container-fluid flex flex-row space-x-3 bg-emerald-700 items-center text-white p-5 w-full">
        <div className="w-1/4 text-center">
          {/* Logo */}
          <a href="/" className='font-bold  px-10 py-2 text-center'>MinSU MARKET</a>
        </div>
        <div className="w-1/4 justify-end items-end">
          <input type="text" className='p-2 bg-white rounded-sm w-[400px] outline-none text-gray-700' />
        </div>
        <div className="min-w-3/6 flex pr-20 space-x-3 items-center whitespace-nowrap justify-end">
          <div className="w-[100px] text-center">
          <a href="" className='font-bold hover:text-emerald-700 hover:bg-white hover:ease-in-out hover:rounded-sm px-2 py-2'>Home</a>
          </div>
          <div className="w-[100px] text-center">
          <a href="" className='font-bold hover:text-emerald-700 hover:bg-white hover:ease-in-out hover:rounded-sm px-2 py-2'>Stores</a>
          </div>
          <div className="w-[100ppx] text-center">
          <a href="" className='font-bold hover:text-emerald-700 hover:bg-white hover:ease-in-out hover:rounded-sm px-2 py-2'>My Cart</a>
          </div>
          <div className="w-[100px] text-center">
          <a href="" className='font-bold hover:text-emerald-700 hover:bg-white hover:ease-in-out hover:rounded-sm px-2 py-2'>Sign In</a>
          </div>
          <div className="w-[100px] text-center">
          <a href="/register" className='font-bold hover:text-emerald-700 hover:bg-white hover:ease-in-out hover:rounded-sm px-2 py-2'>Sign Up</a>
          </div>
        </div>
      </div>
    )
}