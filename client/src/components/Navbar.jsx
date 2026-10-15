import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/operations/authAPI';


const Navbar = () => {
    const token = useSelector((state)=> state.auth.token);
    const user = useSelector((state)=>state.profile.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  return (
    <nav className = "flex justify-between items-center px-6 py-3 border-b">
      <Link to="/" className='text-xl font-bold'>Skillora</Link>
      <div className="flex items-center gap-4">
        
         {!token ? (
  <>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
  </>
) : (
  <>
    <img src={user?.image} alt="avatar" className="w-8 h-8 rounded-full" />
    <span>{user?.firstName}</span>
    <button onClick={() => dispatch(logout(navigate))}>Logout</button>
  </>
)}
        
        
        </div> 
  



    </nav>
  )
}

export default Navbar
