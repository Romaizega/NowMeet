import { Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Home from "./pages/Home"
import Events from "./pages/Events"
import EventDetails from "./pages/EventDetails"
import Header from "./components/Header"
import Footer from "./components/Footer"
import VerifyEmail from "./pages/VerifyEmail"
import ProtectedRoute from "./components/ProtectedRoute"
import GuestRoute from "./components/GuestRoute"
import AboutUs from "./pages/AboutUs"
import Explore from "./pages/Explore"
import HowToWorks from './pages/HowToWorks'
import Meetups from './pages/Meetups'
import CreateEvent from "./pages/CreateEvent"
import ProfileView from "./pages/ProfileView"
import MyEvents from "./pages/MyEvents"
import EventChat from "./pages/EventChat"
import PrivaeChat from "./pages/PrivateChat"

function App() {

  return (
    <>
    <div>
    <Header/>
    <Routes>
      <Route path="/register" element= {<GuestRoute><Register/> </GuestRoute>} />
      <Route path="/login" element= {<GuestRoute><Login/> </GuestRoute>}/>
      <Route path="verify-email" element={<GuestRoute><VerifyEmail/> </GuestRoute>} />
      
      <Route path="/profile" element= {<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/event/:id" element= {<ProtectedRoute><EventDetails /></ProtectedRoute>} />
      <Route path="/profile/:id/private-chat" element= {<ProtectedRoute><PrivaeChat /></ProtectedRoute>} />
      <Route path="/event/create" element= {<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/event/:id/edit" element= {<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/event/my" element= {<ProtectedRoute><MyEvents /></ProtectedRoute>} />
      <Route path="/event/:id/common-chat" element= {<ProtectedRoute><EventChat /></ProtectedRoute>} />

      <Route path="/about" element={<AboutUs/>} />
      <Route path="/explore" element={<Explore/>} />
      <Route path="/how-works" element={<HowToWorks/>} />
      <Route path="/meetups" element={<Meetups/>} />
      <Route path="/" element= {<Home/>}/>
      <Route path="/profile/:id" element={<ProfileView/>}/>
    </Routes>
    <Footer/>
    </div>
    </>
  )
}

export default App