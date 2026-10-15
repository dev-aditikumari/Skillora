
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/operations/authAPI'
import ForgetPassword from './ForgetPassword'

const Login = () => {
    const [formData , setFormData] = useState({
        email :"",
        password :"",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e)=>{
        setFormData(prevData =>({...prevData , [e.target.name] : e.target.value}))
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(login(formData.email , formData.password , navigate))
    }
    
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input className='border p-2 rounded' type='email' name='email' value={formData.email} placeholder='email' onChange={handleChange}/>
            <input className='border p-2 rounded' type='password' name='password' value={formData.password} placeholder = "password" onChange= {handleChange}/>
            <button type = "submit">Submit</button>
            <Link to="/forget-password" >Forget password?</Link>

        </form>
      
    </div>
  )
}

export default Login
