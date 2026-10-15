import React from 'react'
import EditProfile from './settings/EditProfile'
import ChangePassword from './settings/ChangePassword'

const Settings = () => {
  return (
    <div className="max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <EditProfile/>
        <ChangePassword/>

      
    </div>
  )
}

export default Settings
