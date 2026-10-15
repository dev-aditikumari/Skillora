import React from 'react'
import { useSelector } from 'react-redux'
import {  Navigate, useNavigate } from 'react-router-dom'

const OpenRouter = ({children}) => {
    const navigate = useNavigate();
    const token = useSelector((state)=>state.auth.token)
  
    
      if(!token) return children
     return <Navigate to = "/dashboard/my-profile"/>
      
    
   
  
  
}

export default OpenRouter
