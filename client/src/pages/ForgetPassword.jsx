import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgetPassword = () => {
    const [email , setEmail] = useState("");
    const [emailSent , setEmailSent] = useState(false);
    const dispatch = useDispatch();
    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email , setEmailSent))
    }

  return (
    <div className='max-w-md mx-auto mt-16 p-6'>
        <h1 className='text-2xl font-bold mb-2'>
            {!emailSent ? "Reset your password" :"Check your email"}
        </h1>
        <p className='text-grey-600 mb-6'>
        {!emailSent
        ? "Enter your email and we'll send you a link to reset your password":
        `We've sent a reset link to ${email}. It expires in 15 minutes`
        
        
        }
        </p>
   <form  onSubmit={handleSubmit}>
{!emailSent  && (
    <input type= "email" value={email} required placeholder='Enter email address' onChange={(e)=>setEmail(e.target.value)} className='border p-2 rounded'/>
    
)}
<button type='submit' className='bg-indigo-600 text-white p-2 rounded'>

    {!emailSent ?"Send reset link" : "Resend email"}
</button>


   </form>
   <Link to="/login" className='block mt-4 text-indigo-600'>← Back to login</Link>

      
    </div>
  )
}

export default ForgetPassword
