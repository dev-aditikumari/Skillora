import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const OpenRouter = ({children}) => {
    const token = useSelector((state)=>state.auth.token)
  
    
      if(!token) return children
     return <Navigate to = "/dashboard/my-profile"/>
      
    
   
  
  
}

export default OpenRouter
