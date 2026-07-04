import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { clearAuth } from "../features/auth/authSlice";
import { persistor } from "../app/store";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { setAddNotification, setClearNotification } from "../features/notifications/notificationsSlice";
import { Bell, Mail, MapPin } from 'lucide-react';
import api from "../services/axios";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openNotific, setOpenNotific] = useState(false)
  const [openMessages, setOPenMessages] = useState(false)
  const [location, setLocation] = useState('Detecting your location')
  const [localError, setLocalError] = useState()
  const { notifications } = useSelector((state) => state.notification);

  const handleLogout = () => {
    navigate("/");
    dispatch(clearAuth());
    localStorage.removeItem("token");
    persistor.purge();
  };

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.on("new_event", (event) => {
        dispatch(
          setAddNotification({
            id: event.id,
            type: "event",
            text: event.title,
          }),
        );
      });
      socket.on("private_message", (message) => {
        dispatch(
          setAddNotification({
            id: message.id,
            type: "message",
            text: `New message from ${message.username}`,
            senderId: message.sender_user_id,
          })
        )
      } )
      return () => {
        socket.off("new_event");
        socket.off("private_message")
      };
    } else {
      socket.disconnect();
    }
  }, [user]);

  const clearNotification = () => {
    dispatch(setClearNotification())
  }

  const fetchLocation = async (latitude, longitude) => {
    try {
      const { data } = await api.post("/event/geodetect", {
        latitude,
        longitude,
      });
      setLocation(data.navbarLocation);
    } catch (error) {
      setLocalError(error.response?.data?.message || "Failed to get geo data");
    }
  };

 useEffect(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fetchLocation(lat, lng);
      });
  }, []);



  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-8">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">
            <b className=" text">NowMeet</b>
          </Link>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-2 text-base">
            <li className="text-xl">
              <Link to="/explore">Explore</Link>
            </li>
            <li className="text-xl">
              <Link to="/meetups">My Meetups</Link>
            </li>
            <li className="text-xl">
              <Link to="/ai-match">AI Match</Link>
            </li>
            <li className="text-xl">
              <Link to="/inbox">Messages</Link>
            </li>
            <li className="text text-xl">
              <Link to="/how-works">How It Works</Link>
            </li>
            <li className="text text-xl">
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          <div className="">
            <span className="text-sm text-primary opacity-50 flex gap-2">
              <MapPin/>
              {location}</span>
          </div>
          {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
          {user ? (
            <div className="relative">
              <div className="btn btn-ghost "
              onClick={() => setOpenNotific(!openNotific)}
              >
              <button className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <Bell type="event"
                  />
                  <span className="badge badge-xs badge-primary indicator-item">
                    {notifications.filter(n => n.type === 'event').length}
                  </span>
                </div>
              </button>
              </div>
              {openNotific && (
                <ul className="menu bg-base-100 rounded-box absolute right-0 mt-3 w-52 p-2 shadow z-50">
                  <li>
                  {notifications.filter((notification)=> notification.type === "event") 
                  .map((notification) => (
                    <div className="text font-bold"
                    key={notification.id}
                    onClick={() => {navigate('/explore');
                      clearNotification()}
                    }>
                      <Link className="text text-primary">
                      {notification.text}
                      </Link>
                    </div>
                  ))}
                  </li>
                  <li>
                    <a onClick={() => clearNotification()}>
                      Clear notifications
                    </a>
                  </li>
                </ul>
                
              )}
            <div className="btn btn-ghost "
              onClick={() => setOPenMessages(!openMessages)}
              >
              <button className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <Mail type="message"
                  />
                  <span className="badge badge-xs badge-primary indicator-item">
                    {notifications.filter(n => n.type === 'message').length}
                  </span>
                </div>
              </button>
              </div>
                {openMessages && (
                <ul className="menu bg-base-100 rounded-box absolute right-0 mt-3 w-52 p-2 shadow z-50">
                  <li>
                  {notifications.filter((notification)=> notification.type === "message")
                  .map((notification) => (
                    <div className="text "
                    key={notification.id}
                    onClick={() => {navigate(`/profile/${notification.senderId}/private-chat`);
                      clearNotification()}
                    }>
                      <Link className="text text-primary">
                      {notification.text}
                      </Link>
                    </div>
                  ))}
                  </li>
                  <li>
                    <a onClick={() => clearNotification()}>
                      Clear messages
                    </a>
                  </li>
                </ul>
                
              )}
              

              <div
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user.photo
                        ? `${import.meta.env.VITE_SERVER_URL}/uploads/${user.photo}`
                        : "/default-avatar.png"
                    }
                  />
                </div>
              </div>
              {menuOpen && (
                <ul className="menu bg-base-100 rounded-box absolute right-0 mt-3 w-52 p-2 shadow z-50">
                  <li>
                    <h1 className="text font-bold">{user.username}</h1>
                  </li>
                  <li>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
