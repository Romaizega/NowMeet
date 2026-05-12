import { Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Home from "./pages/Home"
import Events from "./pages/Events"
import EventDetails from "./pages/EventDetails"

function App() {
  return (
    <>
    <div>
    <Routes>
      <Route path="/" element= {<Home/>}/>
      <Route path="/register" element= {<Register/>}/>
      <Route path="/login" element= {<Login/>}/>
      <Route path="/profile" element= {<Profile/>}/>
      <Route path="/events/:id" element= {<Events/>}/>
      <Route path="/event-details" element= {<EventDetails/>}/>
    </Routes>
    </div>
    </>
  )
}

export default App