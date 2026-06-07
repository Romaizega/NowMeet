import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { clearAuth } from "../features/auth/authSlice";
import { persistor } from "../app/store";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
    dispatch(clearAuth());
    localStorage.removeItem("token");
    persistor.purge();
  };

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
              <Link to="/meetups">Meetups</Link>
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
          {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
          {user ? (
            
            <div className="relative">
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
