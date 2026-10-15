import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import {endpoints} from '../api';
import {setLoading , setToken }from "../../slices/authSlice";
import { setUser } from '../../slices/profileSlice';

const {SENDOTP_API , SIGNUP_API , LOGIN_API , RESETPASSTOKEN_API , RESETPASSWORD_API , LOGOUT_API , CHANGE_PASSWORD_API} = endpoints ;
export const sendOtp = (email , navigate) =>{
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", SENDOTP_API,{email});
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("OTP Sent");
            navigate("/verify-email");
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message || "Could not send OTP");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);

    }


    

}

export const  signUp =  (accountType , firstName , lastName , email , password , confirmPassword , otp , navigate) =>{

    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
       const response = await apiConnector("POST" , SIGNUP_API, { accountType, firstName, lastName, email, password, confirmPassword, otp });
       if(!response.data.success){
        throw new Error(response.data.message);
       }
       toast.success("Signup Successful");
       navigate("/login")
        }catch(error){
            toast.error(error.response?.data?.message || error.message || "Signup Failed")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);

    }
    
}

export const login = (email , password , navigate) =>{
    return  async (dispatch)=>{
        const toastId = toast.loading("Loading");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST" , LOGIN_API , {email , password});
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Login Successful");
            dispatch(setToken(response.data.token));
            dispatch(setUser(response.data.user));
            localStorage.setItem("token" , JSON.stringify(response.data.token))
            localStorage.setItem("user" , JSON.stringify(response.data.user))
            navigate("/")

        }
        catch(error){
            toast.error(error.response?.data?.message || error.message || "Login Failed")
        }
        dispatch(setLoading(false));
toast.dismiss(toastId);


    }
}

export const getPasswordResetToken = (email , setEmailSent) =>{
    return async (dispatch) =>{
     const toastId = toast.loading("Loading...");
     dispatch(setLoading(true));
     try{
        const response = await apiConnector("POST" , RESETPASSTOKEN_API , {email});
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Reset email sent");
        setEmailSent(true)


     } catch(error){
        toast.error(error.response?.data?.message || error.message || "Failed to send reset email")
     }
     dispatch(setLoading(false));
     toast.dismiss(toastId);
    }
}

export const logout = (navigate) =>{
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , LOGOUT_API);
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("LOGOUT SUCCESSFULL")
        }catch(error){
             toast.error(error.response?.data?.message || error.message || "Failed to logout") 
        }
        dispatch(setLoading(false));
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        toast.dismiss(toastId);
        navigate("/")
    }
}

export const resetPassword =(password , confirmPassword , token , navigate)=>{
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , RESETPASSWORD_API , {password , confirmPassword , token})
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Password reset successfully");
            navigate("/login");

        } catch(error){
           toast.error(error.response?.data?.message || error.message || "Could not reset password")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export const changePassword = (data)=>{
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
    try{
        const response = await apiConnector("POST" , CHANGE_PASSWORD_API , data);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Password changed");
         

    }catch(error){
       toast.error(error.response?.data?.message || error.message || "Could not change password")
    }
    dispatch(setLoading(false));
        toast.dismiss(toastId);
}
}
