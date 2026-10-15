import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'

const Dashboard = () => {
        // TODO: return a wrapper div with className="flex min-h-[calc(100vh-57px)]"
  //   inside it:  <Sidebar />
  //   and:        <div className="flex-1 p-8"> <Outlet /> </div>
  return (
    <div className='flex min-h-[calc(100vh-57px)]'>
        <Sidebar/>
        <div className="flex-1 p-8">
            <Outlet/>
        </div>
    
      
    </div>
  )
}

export default Dashboard
