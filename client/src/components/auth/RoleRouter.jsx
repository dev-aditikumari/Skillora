import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const RoleRouter =({allow , children})=>{
    const {user} = useSelector((state)=> state.profile);
    const allowed = Boolean(user) && allow.includes(user.accountType);


    useEffect(()=>{
        if(user && !allowed)toast.error("Ypu don't have access to this page");

    },[user , allowed]);
    if(!user) return <Navigate to='/login' replace/>
     if(!allowed) return <Navigate to='/dashboard/my-profile' replace/>


    return children
}

export default RoleRouter;