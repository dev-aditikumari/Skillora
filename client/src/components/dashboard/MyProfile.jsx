import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserDetails } from '../../services/operations/profileAPI'

// one label + value; shows "Add <label>" in gray when empty
const Field = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={value ? "" : "text-gray-400"}>{value || `Add ${label}`}</p>
  </div>
)

const MyProfile = () => {
  const user = useSelector((state) => state.profile.user)
  const dispatch = useDispatch()

  useEffect(() => { dispatch(getUserDetails()) }, [dispatch])

  const profile = user?.additionalDetails
  const dob = profile?.dob ? new Date(profile.dob).toLocaleDateString() : ""

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Card 1: avatar, name, email */}
      <div className="border rounded-lg p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={user?.image} alt="avatar" className="w-20 h-20 rounded-full" />
          <div>
            <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <Link to="/dashboard/settings" className="bg-indigo-600 text-white px-4 py-2 rounded">Edit</Link>
      </div>

      {/* Card 2: about */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">About</h2>
        <p className={profile?.about ? "" : "text-gray-400"}>
          {profile?.about || "Write something about yourself"}
        </p>
      </div>

      {/* Card 3: personal details */}
      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name"    value={user?.firstName} />
          <Field label="Last Name"     value={user?.lastName} />
          <Field label="Email"         value={user?.email} />
          <Field label="Phone Number"  value={profile?.contactNumber} />
          <Field label="Gender"        value={profile?.gender} />
          <Field label="Date of Birth" value={dob} />
          <Field label="City"          value={profile?.city} />
          <Field label="Address"       value={profile?.address} />
        </div>
      </div>
    </div>
  )
}

export default MyProfile
