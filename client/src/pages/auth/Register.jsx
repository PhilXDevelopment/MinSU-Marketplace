import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


export default function Register(){
    const [loading, setLoading]=useState(false)
    const [firstname,setFirstName]=useState("");
    const [error_firstname,setErrorFirstName]=useState("");
    const [middlename,setMiddleName]=useState("");
    const [error_middlename,setErrorMiddleName]=useState("");
    const [lastname,setLastName]=useState("");
    const [error_lastname,setErrorLastName]=useState("");
    const [gender,setGender]=useState("");
    const [error_gender,setErrorGender]=useState("");
    const [birthday,setBirthday]=useState("");
    const [error_birthday,setErrorBirthday]=useState("");
    const [email,setEmail]=useState("");
    const [error_email,setErrorEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error_password,setErrorPassword]=useState("");
    const [confirm_password,setConfirmPassword]=useState("");
    const [error_confirm_password,setErrorConfirmPassword]=useState("");
    const apiBaseUrl="http://localhost:5000";




    const handleFirstname=(e)=>{
        const val=e.target.value
        setFirstName(val.toUpperCase())
        if (val.trim() !== "") {
            setErrorFirstName(""); 
            setEmail(`${lastname}.${firstname}@minsu.edu.ph`.toLowerCase())
        } else {
            setErrorFirstName("Field Required");
        }
    }
       const handleMiddlename=(e)=>{
        const val=e.target.value
        setMiddleName(val.toUpperCase())
            if (val.trim() !== "") {
            setErrorMiddleName(""); 
        } else {
            setErrorMiddleName("Field Required");
        }
    }
       const handleLastname=(e)=>{
        const val=e.target.value
        setLastName(val.toUpperCase())
            if (val.trim() !== "") {
            setErrorLastName(""); 
            setEmail(`${lastname}.${firstname}@minsu.edu.ph`.toLowerCase())
        } else {
            setErrorLastName("Field Required");
        }
    }
       const handleBirthday=(e)=>{
        const val=e.target.value
        setBirthday(val)
            if (val.trim() !== "") {
            setErrorBirthday(""); 
        } else {
            setErrorBirthday("Field Required");
        }
    }
       const handleGender=(e)=>{
        const val=e.target.value
        setGender(val)
            if (val.trim() !== "") {
            setErrorGender(""); 
        } else {
            setErrorGender("Field Required");
        }
    }
       const handleEmail=(e)=>{
        
        const val=e.target.value
        setEmail(val)
        switch(true){
            case !val.endsWith("@minsu.edu.ph"):
                setErrorEmail("Email must be @minsu.edu.ph domain")
                break;
            case val.trim()!=="":
                setErrorEmail(""); 
                break;
                default:
                setErrorEmail("Field Required");
        }
    }
       const handlePassword=(e)=>{
        const val=e.target.value
        setPassword(val)
            if (val.trim() !== "") {
            setErrorPassword(""); 
        } else {
            setErrorPassword("Field Required");
        }
    }
       const handleConfirmPassword=(e)=>{
        const val=e.target.value
        setConfirmPassword(val)
    
        switch (true) {
            case val.trim() === "":
            setErrorConfirmPassword("Field Required");
            break;
            case val !== password:
            setErrorConfirmPassword("Password not match!");
            break;
            default:
            setErrorConfirmPassword("");
        }
        
    }

    const handleRegistration=async(e)=>{
        e.preventDefault();
    
        setLoading(true)
            try {
                if (
            !firstname.trim() ||
            !lastname.trim() ||
            !gender.trim() ||
            !birthday.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirm_password.trim()
        ) {
            console.log("all fields are required")
        }
                
            const res = await axios.post(`${apiBaseUrl}/register`, {
                firstname,
                middlename,
                lastname,
                gender,
                birthday,
                email,
                password,
            });
            console.log(res)
            toast(res.data.message)
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong!");
    }finally{
        setLoading(false)
    }

    }
    return(
       <div className="w-full flex justify-center">
        <ToastContainer />
          <form onSubmit={handleRegistration} id="RegisterUserForm" className="w-1/2 bg-white shadow-xl/35 p-3 rounded-sm space-y-4">
        <div className="flex flex-wrap w-full space-x-4 ">
            <div className="w-[30%]">
            <label htmlFor="firstname">First Name</label>
            <input
                type="text"
                required
                value={firstname}
                onChange={handleFirstname}
                className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_firstname ? "border-red-500" : "border-emerald-700"
                }`}
                name="firstname"
                id="firstname"
            />
            <span className="text-red-500 text-sm" id="error_firstname">
                {error_firstname}
            </span>
            </div>

            <div  className="w-[30%]" >
            <label htmlFor="middlename">Middle Name</label>
            <input
                type="text"
                required
                value={middlename}
                onChange={handleMiddlename}
                className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_middlename ? "border-red-500" : "border-emerald-700"
                }`}
                name="middlename"
                id="middlename"
            />
            <span className="text-red-500 text-sm" id="error_middlename">
                {error_middlename}
            </span>
            </div>

            <div  className="w-[30%]">
            <label htmlFor="lastname">Last Name</label>
            <input
                type="text"
                required
                value={lastname}
                onChange={handleLastname}
                className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_lastname ? "border-red-500" : "border-emerald-700"
                }`}
                name="lastname"
                id="lastname"
            />
            <span className="text-red-500 text-sm" id="error_lastname">
                {error_lastname}
            </span>
            </div>
        </div>

        <div className="w-full flex flex-wrap space-x-4">
            <div className="w-[45%]">
            <label htmlFor="birthday">Birthday</label>
            <input
                type="date"
                required
                value={birthday}
                onChange={handleBirthday}
                className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_birthday ? "border-red-500" : "border-emerald-700"
                }`}
                name="birthday"
                id="birthday"
            />
            <span className="text-red-500 text-sm" id="error_birthday">
                {error_birthday}
            </span>
            </div>

            <div  className="w-[45%]">
            <label htmlFor="gender_value">Gender</label>
            <select
                name="gender"
                required
                value={gender}
                onChange={handleGender}
                className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_gender ? "border-red-500" : "border-emerald-700"
                }`}
                id="gender_value"
            >
                <option value="">Choose</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <span className="text-red-500 text-sm" id="error_gender">
                {error_gender}
            </span>
            </div>
        </div>

        <div>
            <label htmlFor="email">Email</label>
            <input
            type="text"
            required
            value={email}
            onChange={handleEmail}
            className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_email ? "border-red-500" : "border-emerald-700"
            }`}
            name="email"
            id="email"
            />
            <span className="text-red-500 text-sm" id="error_email">
            {error_email}
            </span>
        </div>
        <div className="w-full flex  space-x-4">
              <div className="w-[45%]">
            <label htmlFor="password">Password</label>
            <input
            type="password"
            required
            value={password}
            onChange={handlePassword}
            className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_password ? "border-red-500" : "border-emerald-700"
            }`}
            name="password"
            id="password"
            />
            <span className="text-red-500 text-sm" id="error_password">
            {error_password}
            </span>
        </div>

        <div className="w-[45%]">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
            type="password"
            required
            value={confirm_password}
            onChange={handleConfirmPassword}
            className={`w-full text-gray-500 p-2 rounded-sm border ${
                error_confirm_password ? "border-red-500" : "border-emerald-700"
            }`}
            name="confirm_password"
            id="confirm_password"
            />
            <span className="text-red-500 text-sm" id="error_confirm_password">
            {error_confirm_password}
            </span>
        </div>
        </div>

        <button
        type="submit"
        disabled={loading} // ✅ disable when loading
        className={`px-6 py-2 rounded text-white ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
{/* 
        <button type="submit" className="mt-4 bg-emerald-700 text-white px-4 py-2 rounded">
            Submit
        </button> */}
        </form>

       <Outlet/>
        </div>
    )
      
}