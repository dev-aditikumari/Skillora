import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { profileEndpoints } from '../api';
import { setUser } from '../../slices/profileSlice';
import { setToken } from '../../slices/authSlice';

const {GET_USER_DETAILS_API , UPDATE_PROFILE_API , UPDATE_DISPLAY_PICTURE_API , DELETE_PROFILE_API} = profileEndpoints;

// helper: keep Redux and localStorage in sync
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
        toast.error(error.response?.data?.message || "Could not load profile")
    }
}
}
export const updateProfile = (data) => {
  // TODO: loading toast
  // PUT UPDATE_PROFILE_API with `data`
  // success → toast.success("Profile updated")
  //         → dispatch(getUserDetails())   ← re-fetch, so the user in Redux gets the new profile
  // dismiss the toast at the end
  return async (dispatch)=>{
    try{
    const response = await apiConnector("PUT" , UPDATE_PROFILE_API  , data);
    if(!response.data.success){
        throw new Error(response.data.message)
    }
    toast.success("Profile updated");
    dispatch(getUserDetails())
}catch(error){
    toast.error(error.response?.data?.message || "Could not upload profile")
}
  }
}

export const updateDisplayPicture = (formData) => {
  // TODO: loading toast
  // PUT UPDATE_DISPLAY_PICTURE_API with `formData`
  //   (formData is a FormData object. axios sends it as a file upload automatically)
  // success → saveUser(dispatch, response.data.user)   ← the server already returns the updated user
  //         → toast.success("Picture updated")
   return async(dispatch)=>{
   try{
    const response = await apiConnector("PUT" , UPDATE_DISPLAY_PICTURE_API , formData);
    if(!response.data.success){
        throw new Error(response.data.message);
    }
    toast.success("Updated Display picture");
    saveUser(dispatch  , response.data.user);

   }catch(error){
    toast.error(error.response?.data?.message || "Could not upload display picture")
   }
}
}

export const deleteProfile = (navigate) => {
  // TODO: loading toast
  // DELETE DELETE_PROFILE_API
  // success → toast.success("Account deleted")
  //         → clear everything, exactly like the end of your logout thunk:
  //             setToken(null), setUser(null), remove "token" and "user" from localStorage
  //         → navigate("/")

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
toast.error(error.response?.data?.message || "Could not able to delete profile")

  }
  }

}
