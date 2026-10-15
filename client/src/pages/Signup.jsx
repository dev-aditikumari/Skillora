import React , {useState}  from 'react'
import { sendOtp } from '../services/operations/authAPI';

import { useDispatch  } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import { setSignUpData } from '../slices/authSlice';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName :"",
        lastName :"",
        email:"",
        password:"",
        confirmPassword :"",

    })
    const [type , setType] = useState("Student");
    const handleChange =(e) => {
       
     setFormData(prev=>({...prev , [e.target.name] : e.target.value}));
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault(); 
        if(formData.password !== formData.confirmPassword){
            toast.error("Passwords do not match");
            return ;
        }
        dispatch(setSignUpData({...formData , accountType : type}));
        dispatch(sendOtp(formData.email, navigate))
        console.log(formData);
    }
    const changeType=()=>{
        if(type === "Student"){
            setType("Instructor");
        }
        else{
            setType("Student");
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
           <input type ="text" name='firstName' placeholder="First Name" value={formData.firstName} onChange={handleChange} />
           <input type ="text" name='lastName' placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
           <input type="email" name = "email" placeholder="Email" value={formData.email} onChange={handleChange}/>
            <input type ="password" name='password' placeholder="Password" value={formData.password} onChange={handleChange} />
             <input type ="password" name='confirmPassword' placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}/>
             <button type='button'  onClick ={changeType}>change {type}</button>
             <button type = "submit">Sign Up</button>
        </form>
      
    </div>
  )
}

export default Signup
