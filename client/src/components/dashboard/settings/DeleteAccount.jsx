import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteProfile } from '../../../services/operations/profileAPI'

const DeleteAccount = () => {
    const dispatch = useDispatch();
    const navigate =  useNavigate();

 const handleDelete = () => {
    const sure = window.confirm("Delete your account? This cannot be undone.")
    if (!sure) return                 // ← stop if the user clicked Cancel
    dispatch(deleteProfile(navigate))                   // ← call deleteProfile, it needs navigate
  }

  return (
    <div className="border border-red-300 bg-red-50 rounded-lg p-6">
      <h2 className="font-semibold text-red-700 mb-2">Delete Account</h2>
      <p className="text-sm text-gray-600 mb-4">
        This permanently deletes your account and profile. You can't undo this.
      </p>
      <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
        Delete my account
      </button>
    </div>
  )
}
export default DeleteAccount