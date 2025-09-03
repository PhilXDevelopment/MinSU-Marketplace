import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './index.css'
import Loader from './Loader.jsx'
import Header from './Header.jsx'
import MainContent from './MainContent.jsx'

export default function Layout() {

  const [loading, setLoading]=useState(true);
  useEffect(()=>{
    const timer=setTimeout(() => {
      setLoading(false)
    }, 2000);
    return()=>clearTimeout(timer);
  },[]);

  return (  
    <>
    {loading ? <Loader/>: <MainContent/>}
    </>
  )
}

