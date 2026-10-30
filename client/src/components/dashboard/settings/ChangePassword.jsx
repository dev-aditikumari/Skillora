
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
      toast.error("Password doesn't match");
     return ;
    }
    dispatch(changePassword(formData));
  }

  return (
   <form  onSubmit={handleSubmit} className='border rounded-lg p-6'>
     <h2 className='font-semibold mb-4'>Change Password</h2>
     <div className='flex flex-col gap-4'> 
      <input type='password' value={formData.oldpassword} placeholder='Current password' onChange={handleChange} name='oldpassword' className="border p-2 rounded" /> 
       <input type='password' value={formData.newpassword} placeholder='New password' onChange={handleChange} name='newpassword' className="border p-2 rounded" /> 
        <input type='password' value={formData.confirmpassword} placeholder='Confirm password' onChange={handleChange} name='confirmpassword' className="border p-2 rounded" /> 
        <button type="submit"  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Update Password</button>
     </div>
   </form>
  )
}

export default ChangePassword
