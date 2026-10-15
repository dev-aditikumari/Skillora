import React from 'react'
import { useSelector , useDispatch } from 'react-redux'
import { setToken } from '../slices/authSlice'
const Home = () => {
    const token = useSelector((state)=>state.auth.token);
    const dispatch = useDispatch();

  return (
    <div>
        <p>{String(token)}</p>
        <button onClick={()=>{dispatch(setToken("abc123"))}}>click</button>
      
    </div>
  )
}

export default Home
