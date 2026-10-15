
import './App.css'
import {Routes  , Route} from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import OpenRouter from './components/auth/OpenRouter'
import PrivateRouter from './components/auth/PrivateRouter'
import Dashboard from './pages/Dashboard'
import ForgetPassword from './pages/ForgetPassword'
import UpdatePassword from './pages/UpdatePassword'
import MyProfile from './components/dashboard/MyProfile'
import Settings from './components/dashboard/Settings'


function App() {

  return (
    <>
    <Navbar/>
    
    <Routes>

      <Route path ="/" element={<Home/>}/>
       <Route path = "/signup" element = {<OpenRouter><Signup/></OpenRouter>}/>
       <Route path='/login' element={<OpenRouter><Login/></OpenRouter>}/>
       <Route path = "/verify-email" element = {<OpenRouter><VerifyEmail/></OpenRouter>} />
       <Route path = "/forget-password" element={<OpenRouter><ForgetPassword/></OpenRouter>}/>
       <Route path='/update-password/:id' element={<OpenRouter><UpdatePassword/></OpenRouter>}/>
       <Route path= "/dashboard" element={<PrivateRouter><Dashboard/></PrivateRouter>}>
          <Route path='my-profile' element={<MyProfile/>}/>
          <Route path='settings' element= {<Settings/>}/>
       
       </Route>
      <Route path = "*" element = {<NotFound/>}/>
     
    </Routes>
   
    <Toaster/>
    
     
    </>
  )
}

export default App
