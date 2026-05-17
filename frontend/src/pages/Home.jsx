import heroImg from "../assests/hero.png"
import { Link } from "react-router-dom"

export default function Home () {
  return(
    <>
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          `url(${heroImg})`,
      }}
    >
      <div className="hero-overlay bg-black/10"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-6xl font-bold">Tonight Starts Here</h1>
          <p className="mb-5 text-lg">
            Discover spontaneous meetups near you - join real conversations,
            find good company, and make tonight unforgettable. 
          </p>
          <Link to="/register" className="btn btn-netural btn-lg">Get Started</Link>
        </div>
      </div>
    </div>
    </>
  )
}