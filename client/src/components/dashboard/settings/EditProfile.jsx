import React from 'react'
import { useDispatch, useSelector } from 'react-redux'


const EditProfile = () => {
    const user = useSelector((state)=>state.profile.user);
    const dispatch = useDispatch();
    const profile = user?.additionalDetails;
    const [formData , setFormdata] = useState({
        about :"" , gender:"" , dob:"" , city:"" , address:"",
    })
  return (
    <div>
      
    </div>
  )
}

export default EditProfile
