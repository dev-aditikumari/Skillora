import { useEffect , useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateProfile } from '../../../services/operations/profileAPI'


const EditProfile = () => {
    const user = useSelector((state)=>state.profile.user);
    const dispatch = useDispatch();
    const profile = user?.additionalDetails;
    const [formData , setFormData] = useState({
        about :"" , gender:"" , dob:"" , contactNumber:"" , city:"" , address:"",
    })
    // load the full profile
    useEffect(()=> { dispatch(getUserDetails()) },[dispatch]);
    // when the profile arrives, fill the form with it
    useEffect(()=>{
        setFormData({
            about : profile?.about || "" ,
            gender : profile?.gender || "" ,
            dob : profile?.dob ? profile.dob.slice(0, 10) : "" ,   // date input needs YYYY-MM-DD
            contactNumber : profile?.contactNumber || "" ,
            city : profile?.city || "" ,
            address: profile?.address || "",
        });
    },[profile])
    const handleChange =(e)=>{
        setFormData(prevData=>({...prevData , [e.target.name]:e.target.value}))
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(updateProfile(formData))
    }
  return (
  <form onSubmit={handleSubmit} className="border rounded-lg p-6">
    <h2 className="font-semibold mb-4">Profile Information</h2>
    <div className="grid grid-cols-2 gap-4">
        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder='Phone number' className="border p-2 rounded"/>
        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border p-2 rounded"/>
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder='City' className="border p-2 rounded"/>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder='Address' className="col-span-2 border p-2 rounded"/>
        <textarea name="about" value={formData.about} onChange={handleChange} placeholder='About' rows={4} className="col-span-2 border p-2 rounded"/>
      </div>
      <button type="submit" className="btn-primary mt-4">Save</button>
  </form>
  )
}

export default EditProfile
