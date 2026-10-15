import { NavLink } from "react-router-dom";

// TODO 1: return an <aside className="w-56 border-r p-4 flex flex-col gap-2">
// TODO 2: inside, two NavLinks:
//    <NavLink to="/dashboard/my-profile">My Profile</NavLink>
//    <NavLink to="/dashboard/settings">Settings</NavLink>
// TODO 3: highlight the current page. NavLink can take a FUNCTION as className:
//    className={({ isActive }) => isActive ? "bg-indigo-100 text-indigo-700 p-2 rounded" : "p-2 rounded hover:bg-gray-100"}


import React from 'react'

const Sidebar = () => {
  return (
    <aside className="w-56 border-r p-4 flex flex-col gap-2">
        <NavLink className={({ isActive }) => isActive ? "bg-indigo-100 text-indigo-700 p-2 rounded" : "p-2 rounded hover:bg-gray-100"} to="/dashboard/my-profile">My Profile</NavLink>
        <NavLink className={({ isActive }) => isActive ? "bg-indigo-100 text-indigo-700 p-2 rounded" : "p-2 rounded hover:bg-gray-100"} to="/dashboard/settings">Settings</NavLink>


     
      
    </aside>
  )
}

export default Sidebar
