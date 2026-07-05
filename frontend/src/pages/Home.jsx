import { useNavigate } from "react-router-dom";
import heroImg from "../assests/hero.png";
import {
  Users,
  UserPlus,
  MapPin,
  Zap,
  Search,
  CirclePlus,
  Calendar,
  Coffee,
  Wine,
  LayoutGrid,
  Utensils,
  TentTree,
  SportShoe,
  Dices,
  Palette,
  Ellipsis,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay bg-black/50 lg:bg-black/25"></div>
        <div className="relative z-10 flex w-full min-h-screen items-start px-5 lg:px-16 pt-20 lg:pt-28">
          <div className="w-full max-w-6xl text-left">
            <p className="text-sm tracking-widest uppercase text-primary mb-4">
              Real People. Real Places. Tonight.
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Find people to meet
              <br />
              <span className="text-primary">tonight</span>
            </h1>
            <p className="py-6 text-base lg:text-xl opacity-80 text-primary max-w-xl">
              <b>
                Join spontaneous meetups near you — coffee, drinks,
                <br />
                walks, or real conversations with people
                <br /> who are open to meet now.
              </b>
            </p>
            <div className="flex flex-col md:flex-row gap-5">
              <button
                to="/events"
                className="btn btn-outline btn-primary w-full md:w-auto md:px-28"
                onClick={() => navigate("/explore")}
              >
                <Search className="w-5 h-5" />
                Find a Meetup
              </button>
              <button
                to="/create"
                className="btn btn-outline btn-primary px-18"
                onClick={() => navigate("/event/create")}
              >
                <CirclePlus className="w-5 h-5" />
                Create a Meetup
              </button>
            </div>
            <div className="mt-12 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 px-6 lg:px-10 py-3 w-full lg:w-fit">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />

              <span className="text-primary font-semibold">
                AI Smart Search • Coming Soon
              </span>
            </div>{" "}
            <div className="grid grid-cols-2 lg:flex gap-6 lg:gap-12 mt-10">
              <div className="flex items-center gap-2">
                <Users className="text-primary w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">120+</p>
                  <p className="text-sm opacity-70">Meetups today</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="text-primary w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">8K+</p>
                  <p className="text-sm opacity-70">Active people</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm opacity-70">Cities</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-primary w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm opacity-70">Real moments</p>
                </div>
              </div>
            </div>
            {/* Search bar */}
            <div className="mt-10">
              <div className="flex flex-col lg:flex-row lg:items-center bg-base-300 rounded-xl p-5 gap-5">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="text-primary w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold">Tel-Aviv, TLV</p>
                    <p className="text-xs opacity-60">Change location</p>
                  </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="text-primary w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold">Anytime</p>
                    <p className="text-xs opacity-60">Today or later</p>
                  </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex items-center gap-2 flex-1">
                  <Users className="text-primary w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold">All Meetups</p>
                    <p className="text-xs opacity-60">Any category</p>
                  </div>
                </div>
                <button className="btn btn-primary btn-lg w-full lg:w-auto">
                  <Search className="w-5 h-5" /> Search
                </button>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-3 mt-5 justify-center lg:justify-start">
                <button className="btn btn-outline btn-sm text-primary px-6 h-10">
                  <LayoutGrid className="text-primary w-6 h-6" /> All
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <Wine className="text-primary w-6 h-6" /> Drinks
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <Coffee className="text-primary w-6 h-6" /> Coffee
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <Utensils className="text-primary w-6 h-6" /> Dinner
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <TentTree className="text-primary w-6 h-6" /> Outdoors
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <SportShoe className="text-primary w-6 h-6" /> Walks
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <Dices className="text-primary w-6 h-6" /> Games
                </button>
                <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                  <Palette className="text-primary w-6 h-6" /> Arts & Culture
                </button>
                <button className="btn btn-outline btn-sm text-primary h-10">
                  <Ellipsis className="text-primary w-6 h-6" /> More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
