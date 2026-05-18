import {Link} from 'react-router-dom'

export default function Header () {
  return (
    <>
<div className="navbar bg-base-100 shadow-sm px-8">
  <div className='navbar-start'>
    <Link to="/" className= "btn btn-ghost text-xl"><b>NowMeet</b></Link>
  </div>
  <div className='navbar-center hidden md:flex'>
    <ul className="menu menu-horizontal gap-2 text-base">
    <li><Link to="/explore">Explore</Link></li>   
    <li><Link to="/meetups">Meetups</Link></li>   
    <li><Link to="/how-works">How It Works</Link></li>   
    <li><Link to="/about">About Us</Link></li>   
    </ul>
  </div>

  <div className="navbar-end">
    {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
    </>
  )

}