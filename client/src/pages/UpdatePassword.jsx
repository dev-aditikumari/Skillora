import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../services/operations/authAPI';



import {toast} from 'react-hot-toast'


const UpdatePassword = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [formData , setFormData] = useState({
        password : "",
        confirmPassword: ""
    })
    const handleChange =(e)=>{
        setFormData(prevData =>({...prevData , [e.target.name] : e.target.value}));

    }
    const onSubmit =(e)=>{
       e.preventDefault();
       if(formData.password !== formData.confirmPassword){
          toast.error("Passwords do not match");
          return ;
       }
       dispatch(resetPassword(formData.password , formData.confirmPassword , id , navigate))
    }
  return (
    <div className='max-w-md mx-auto mt-16 p-6'>
        <h1 className='text-2xl font-bold mb-6'>Choose new password</h1>
        <form onSubmit={onSubmit} className='flex flex-col gap-4'> 
            <input value={formData.password} name='password' type="password" placeholder='Password' onChange={handleChange} />
            <input value={formData.confirmPassword} name='confirmPassword' type='password' placeholder='confirmPassword' onChange={handleChange}/>
            <button type='submit' className='bg-indigo-600 text-white p-2 rounded'>Reset password</button>

        </form>
        <Link to="/login" className='block mt-4 text-indigo-600'>← Back to login</Link>
      
    </div>
  )
}

export default UpdatePassword
 