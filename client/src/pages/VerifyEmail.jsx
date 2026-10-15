
import {useState , useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import  { signUp, sendOtp } from '../services/operations/authAPI'
const VerifyEmail = () => {
    const signupData = useSelector((state)=>state.auth.signupData);
    const navigate = useNavigate();
    const [otp , setOtp] = useState("");
    const dispatch = useDispatch();
   useEffect(()=>{  
    if(!signupData){
        navigate("/signup");
    }
    } , [signupData , navigate]);

    const handleSubmit =(e)=>{
        e.preventDefault();
        const {accountType , firstName , lastName , email , password , confirmPassword} = signupData;
        dispatch(signUp(accountType, firstName , lastName , email , password , confirmPassword , otp , navigate));
       
    }
  return (
    <div>
        <form onSubmit = {handleSubmit}>
         <input type="text" className='border p-2 rounded'  value={otp} placeholder='OTP' onChange={(e)=>setOtp(e.target.value)}/>
         <button type='submit' className='border p-2 rounded'>Submit</button>
         <button type='button' onClick={()=> dispatch(sendOtp(signupData.email , navigate))}>Resend OTP</button>


        </form>
      
    </div>
  )
}

export default VerifyEmail
