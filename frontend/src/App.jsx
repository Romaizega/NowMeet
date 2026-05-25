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
      {/* <Route path="/event-details" element= {<ProtectedRoute><EventDetails /></ProtectedRoute>} /> */}

      <Route path="/about" element={<AboutUs/>} />
      <Route path="/explore" element={<Explore/>} />
      <Route path="/how-works" element={<HowToWorks/>} />
      <Route path="/meetups" element={<Meetups/>} />
      <Route path="/" element= {<Home/>}/>
    </Routes>
    <Footer/>
    </div>
    </>
  )
}

export default App