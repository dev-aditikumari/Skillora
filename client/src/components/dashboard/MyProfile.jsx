import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserDetails } from '../../services/operations/profileAPI'

// one label + value; shows "Add <label>" in gray when empty
const Field = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`break-words ${value ? "" : "text-slate-400"}`}>{value || `Add ${label}`}</p>
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
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex min-w-0 items-center gap-4">
          <img src={user?.image} alt="Your profile picture" className="size-16 shrink-0 rounded-full object-cover sm:size-20" />
          <div className="min-w-0">
            <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="truncate text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Link to="/dashboard/settings" className="btn-primary">Edit</Link>
      </div>

      {/* Card 2: about */}
      <div className="card mb-6 p-6">
        <h2 className="font-semibold mb-2">About</h2>
        <p className={profile?.about ? "" : "text-gray-400"}>
          {profile?.about || "Write something about yourself"}
        </p>
      </div>

      {/* Card 3: personal details */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Personal Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
