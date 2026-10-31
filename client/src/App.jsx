import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/common/Footer'
import OpenRouter from './components/auth/OpenRouter'
import PrivateRouter from './components/auth/PrivateRouter'
import RoleRouter from './components/auth/RoleRouter'

import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
import ForgetPassword from './pages/ForgetPassword'
import UpdatePassword from './pages/UpdatePassword'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import CourseDetails from './pages/CourseDetails'
import ViewCourse from './pages/ViewCourse'

import MyProfile from './components/dashboard/MyProfile'
import Settings from './components/dashboard/Settings'
import MyCourses from './components/dashboard/MyCourses'
import EnrolledCourses from './components/dashboard/EnrolledCourses'
import EditCourse from './components/dashboard/EditCourse'
import InstructorDashboard from './components/dashboard/InstructorDashboard'
import AddCourse from './components/dashboard/AddCourse'
import AdminDashboard from './components/dashboard/AdminDashboard'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* logged-out only */}
        <Route path="/signup" element={<OpenRouter><Signup /></OpenRouter>} />
        <Route path="/login" element={<OpenRouter><Login /></OpenRouter>} />
        <Route path="/verify-email" element={<OpenRouter><VerifyEmail /></OpenRouter>} />
        <Route path="/forget-password" element={<OpenRouter><ForgetPassword /></OpenRouter>} />
        <Route path="/update-password/:id" element={<OpenRouter><UpdatePassword /></OpenRouter>} />

        {/* logged-in dashboard */}
        <Route path="/dashboard" element={<PrivateRouter><Dashboard /></PrivateRouter>}>
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {/* instructor only */}
          <Route path="instructor" element={<RoleRouter allow={["Instructor"]}><InstructorDashboard /></RoleRouter>} />
          <Route path="my-courses" element={<RoleRouter allow={["Instructor"]}><MyCourses /></RoleRouter>} />
          <Route path="add-course" element={<RoleRouter allow={["Instructor"]}><AddCourse /></RoleRouter>} />
          <Route path="edit-course/:courseId" element={<RoleRouter allow={["Instructor"]}><EditCourse /></RoleRouter>} />

          {/* admin only */}
          <Route path="admin" element={<RoleRouter allow={["Admin"]}><AdminDashboard /></RoleRouter>} />

          {/* student only */}
          <Route path="enrolled-courses" element={<RoleRouter allow={["Student"]}><EnrolledCourses /></RoleRouter>} />
        </Route>

        {/* the video player: students only, full width, outside the dashboard */}
        <Route
          path="/view-course/:courseId"
          element={
            <PrivateRouter>
              <RoleRouter allow={["Student"]}>
                <ViewCourse />
              </RoleRouter>
            </PrivateRouter>
          }
        />

        {/* public */}
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <Toaster position="top-center" />
    </>
  )
}

export default App