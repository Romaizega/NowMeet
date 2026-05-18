import heroImg from "../assests/hero.png";
import { Link } from "react-router-dom";
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
  Ellipsis 
} from "lucide-react";

export default function Home() {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay bg-black/20"></div>
        <div className="relative z-10 flex w-full min-h-screen items-start pl-16 pt-32">
          <div className="w-full lg:w-1/2 text-left">
            <p className="text-sm tracking-widest uppercase text-primary mb-4">
              Real People. Real Places. Tonight.
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Find people to meet
              <br />
              <span className="text-primary">tonight</span>
            </h1>
            <p className="py-6 text-lg opacity-80 text-primary">
              <b>
                Join spontaneous meetups near you — coffee, drinks,
                <br />
                walks, or real conversations with people
                <br /> who are open to meet now.
              </b>
            </p>
            <div className="flex gap-5">
              <Link to="/events" className="btn btn-outline btn-primary px-18">
                <Search className="w-5 h-5" />
                Find a Meetup
              </Link>
              <Link to="/create" className="btn btn-outline btn-primary px-18">
                <CirclePlus className="w-5 h-5" />
                Create a Meetup
              </Link>
            </div>
            <div className="flex gap-14 mt-10">
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
          </div>
        </div>

        <div className="absolute bottom-80 left-0 right-0 z-20 px-8">
          <div className="max-w-7xl ml-6">
            <div className="flex items-center bg-base-300 rounded-xl p-4">
              <div className="flex items-center gap-2 flex-1">
                <MapPin className="text-primary w-6 h-6" />
                <div>
                  <p className="text-sm font-bold">Tel-Aviv, TLV</p>
                  <p className="text-xs opacity-6000">Change location</p>
                </div>
              </div>

              <div className="divider divider-horizontal"></div>

              <div className="flex items-center gap-2 flex-1">
                <Calendar className="text-primary w-6 h-6" />
                <div>
                  <p className="text-sm font-bold">Anytime</p>
                  <p className="text-xs opacity-60">Today or later</p>
                </div>
              </div>

              <div className="divider divider-horizontal"></div>

              <div className="flex items-center gap-2 flex-1">
                <Users className="text-primary w-6 h-6" />
                <div>
                  <p className="text-sm font-bold">All Meetups</p>
                  <p className="text-xs opacity-60">Any category</p>
                </div>
              </div>

              <button className="btn btn-primary btn-lg">
                <Search className="w-5 h-5" /> Search
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <button className="btn btn-outline btn-sm text-primary px-6 h-10">
                <LayoutGrid className="text-primary w-6 h-6"/>
                All
              </button>

              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <Wine className="text-primary w-6 h-6"/>
                Drinks
              </button>
              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <Coffee className="text-primary w-6 h-6" />
                Coffee
              </button>
              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <Utensils className="text-primary w-6 h-6"/>
                Dinner
              </button>
              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <TentTree className="text-primary w-6 h-6"/>
                Outdoors
                </button>
              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <SportShoe className="text-primary w-6 h-6"/>
                Walks
                </button>
              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <Dices className="text-primary w-6 h-6"/>
                Games
                </button>
              <button className="btn btn-outline btn-sm text-primary px-8 h-10">
                <Palette className="text-primary w-6 h-6"/>
                Arts & Culture
              </button>
              <button className="btn btn-outline btn-sm text-primary h-10">
                <Ellipsis className="text-primary w-6 h-6"/>
                More
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
