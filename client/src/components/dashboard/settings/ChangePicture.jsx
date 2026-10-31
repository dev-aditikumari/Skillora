import Avatar from "../../common/Avatar";
import React from 'react' ;
import { useState } from 'react' ;
import { useDispatch , useSelector } from 'react-redux' ;
import { updateDisplayPicture } from '../../../services/operations/profileAPI' ;

const ChangePicture = () => {
    const user = useSelector((state)=>state.profile.user);
    const dispatch = useDispatch();
    const [file , setFile] = useState(null);
    const [preview , setPreview] = useState(null);
    const handleChange = (e)=>{
        const chosen = e.target.files[0];
        if(!chosen)return
        setFile(chosen);
        setPreview(URL.createObjectURL(chosen))
    }
    const handleUpload=()=>{
        if(!file) return;
        const formData = new FormData();
        formData.append("displayProfile" , file)
        dispatch(updateDisplayPicture(formData))
    }

  return (
    <div className='border rounded-lg p-6 flex items-center gap-6'>
        <Avatar src={preview || user?.image} firstName={user?.firstName} lastName={user?.lastName} className='size-20 text-2xl' alt='Your profile picture' />
        <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>Change Profile Picture</h2>
            <div className="flex gap-3">
                <input type='file' accept='image/*' onChange={handleChange}/>
                <button onClick={handleUpload}  disabled = {!file} className="btn-primary">
            Upload
            </button>


            </div>
        </div>
      
    </div>
  )
}

export default ChangePicture
