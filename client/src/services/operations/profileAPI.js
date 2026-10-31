import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { profileEndpoints } from '../api';
import { setUser } from '../../slices/profileSlice';
import { setToken } from '../../slices/authSlice';

const {GET_USER_DETAILS_API , UPDATE_PROFILE_API , UPDATE_DISPLAY_PICTURE_API , DELETE_PROFILE_API,GET_ENROLLED_COURSES_API} = profileEndpoints;

const saveUser = (dispatch , user) =>{
    dispatch(setUser(user));
    localStorage.setItem("user",JSON.stringify(user));
}

export const getUserDetails = ()=>{
return async (dispatch)=>{
    try{
        const response = await apiConnector("GET" , GET_USER_DETAILS_API);
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        saveUser(dispatch , response.data.user)

    }catch(error){
        toast.error(error.response?.data?.message || "Could not load your profile")
    }
}
}
export const updateProfile = (data) => {
  return async (dispatch)=>{
    try{
    const response = await apiConnector("PUT" , UPDATE_PROFILE_API  , data);
    if(!response.data.success){
        throw new Error(response.data.message)
    }
    toast.success("Profile updated");
    dispatch(getUserDetails())
}catch(error){
    toast.error(error.response?.data?.message || "Could not update your profile")
}
  }
}

export const updateDisplayPicture = (formData) => {
   return async(dispatch)=>{
   try{
    const response = await apiConnector("PUT" , UPDATE_DISPLAY_PICTURE_API , formData);
    if(!response.data.success){
        throw new Error(response.data.message);
    }
    toast.success("Profile picture updated");
    saveUser(dispatch  , response.data.user);

   }catch(error){
    toast.error(error.response?.data?.message || "Could not update your profile picture")
   }
}
}

export const deleteProfile = (navigate) => {

  return async (dispatch)=>{
    try{
        const response = await apiConnector("DELETE" , DELETE_PROFILE_API);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
          toast.success("Account deleted")
        dispatch(setUser(null));
    
    dispatch(setToken(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/")}
    catch(error){
toast.error(error.response?.data?.message || "Could not delete your account")

  }
  }

}

export const fetchEnrolledCourses = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ENROLLED_COURSES_API);
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not fetch enrolled courses");
  }
  return result;
};
