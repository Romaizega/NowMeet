import { useNavigate } from "react-router-dom";
import {
  House,
} from "lucide-react";

import hero404 from "../assests/hero_404.webp";

export default function NoFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-14 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}

        <div className="card bg-base-200 border border-orange-400/10 shadow-xl overflow-hidden">
          <div
            className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${hero404})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="card-body items-center text-center px-5 py-10 lg:py-14">
            <h1 className="text-2xl sm:text-4xl lg:text-4xl font-bold text-primary">
              Oops! Looks like you've wandered off
            </h1>

            <p className="max-w-xl mt-3 text-base lg:text-xl text-primary opacity-60 leading-relaxed">
              The page you're looking for doesn't exist or may have been moved.
              Don't worry - let's get you back to something great
            </p>

            <button
              className="btn border-none bg-orange-400 hover:bg-orange-300 text-black rounded-xl px-8 mt-6 text-base lg:text-lg"
              onClick={() => navigate("/")}
            >
              <House className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}