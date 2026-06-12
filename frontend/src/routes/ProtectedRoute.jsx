import React from 'react'
import { Navigate } from 'react-router-dom'
import { checkIsAdmin } from '../services/userService'
import { useEffect,useState } from 'react'
const ProtectedRoute = ({children}) => {

    const token = localStorage.getItem("token")

    if(!token)
        return <Navigate to={"/"}/>
    
  return (
    children
  )
}

export default ProtectedRoute

