
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { changePassword } from '../../../services/operations/authAPI'
import toast from 'react-hot-toast'
const ChangePassword = () => {
  const dispatch = useDispatch();
  const [formData , setFormData] = useState({
    oldpassword :"" , newpassword :"" , confirmpassword :"",
  })
  const handleChange =(e)=>{
    setFormData((prevData)=> ({...prevData , [e.target.name] : e.target.value }));

  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(formData.confirmpassword !== formData.newpassword){
      toast.error("Passwords do not match");
     return ;
    }
    dispatch(changePassword(formData));
  }

  return (
   <form  onSubmit={handleSubmit} className='card p-6'>
     <h2 className='font-semibold mb-4'>Change Password</h2>
     <div className='flex flex-col gap-4'> 
      <input type='password' autoComplete='current-password' value={formData.oldpassword} placeholder='Current password' onChange={handleChange} name='oldpassword' className="border p-2 rounded" /> 
       <input type='password' autoComplete='new-password' value={formData.newpassword} placeholder='New password' onChange={handleChange} name='newpassword' className="border p-2 rounded" /> 
        <input type='password' autoComplete='new-password' value={formData.confirmpassword} placeholder='Confirm password' onChange={handleChange} name='confirmpassword' className="border p-2 rounded" /> 
        <button type="submit"  className="btn-primary mt-2 self-start">Update Password</button>
     </div>
   </form>
  )
}

export default ChangePassword
