import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom';

const PrivateRouter = ({children}) => {
    const token = useSelector((state)=> state.auth.token);
   
   
      if(token) return children
     return <Navigate to = "/login"/>
      
}

export default PrivateRouter
