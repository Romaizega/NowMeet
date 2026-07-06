import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  MessageCircle,
  CalendarCheck,
  Star,
  ArrowRight,
} from "lucide-react";

import communityImg from "../assests/community.png";

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Explore Events",
      text: "Browse meetups around you and find events that match your interests",
    },
    {
      id: 2,
      icon: Users,
      title: "Join People",
      text: "Join a meetup, see who is going, and connect with people nearby",
    },
    {
      id: 3,
      icon: MessageCircle,
      title: "Chat Before Meeting",
      text: "Use event chat to talk with participants before the meetup starts",
    },
    {
      id: 4,
      icon: CalendarCheck,
      title: "Meet in Real Life",
      text: "Come to the event, enjoy the atmosphere, and create real connections",
    },
    {
      id: 5,
      icon: Star,
      title: "Stay Connected",
      text: "Find more meetups, meet familiar faces, and build your social circle",
    },
  ];

  return (
    <>
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-14 pt-10 lg:pt-20">
        <div className="w-full text-left">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-primary">
              How <span className="text-orange-400">NowMeet</span> Works
            </h1>

            <p className="text-sm sm:text-base lg:text-xl tracking-widest text-primary mt-4 opacity-50">
              Discover events, meet people, and build real connections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 w-full mt-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.id}>
                  <div className="card bg-base-200 shadow-xl overflow-hidden relative h-full mt-2 border border-orange-400/10 hover:border-orange-400/40 transition-all">
                    <div className="card-body">
                      <span className="absolute top-3 left-3 z-20 rounded-full bg-orange-400 px-3 py-1 text-black font-bold">
                        {step.id}
                      </span>

                      <div className="flex justify-center mt-8 mb-6">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-orange-400/30 bg-black/40 flex items-center justify-center">
                          <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-primary" />
                        </div>
                      </div>

                      <p className="text-lg lg:text-xl text-primary font-bold">
                        {step.title}
                      </p>

                      <p className="text-primary text-sm lg:text-lg opacity-50 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card bg-base-200 shadow-xl overflow-hidden relative h-full mt-10 border border-orange-400/10">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                <img
                  src={communityImg}
                  alt="Community"
                  className="w-full sm:w-2/3 lg:w-1/3 max-h-64 lg:max-h-80 object-contain rounded-xl"
                />

                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                    Real people. Real connections. Real life
                  </h2>

                  <p className="text-primary text-base lg:text-xl opacity-50 mt-4 leading-relaxed">
                    NowMeet is more than just events. It is a place where people
                    discover shared interests, meet face-to-face, and create new
                    friendships
                  </p>
                </div>

                <button
                  className="flex items-center justify-center gap-3 lg:gap-4 rounded-xl border border-white bg-black/40 w-full lg:w-auto px-6 lg:px-14 py-3 lg:py-4 text-primary text-base lg:text-xl transition-all hover:bg-white-400 hover:text-white"
                  onClick={() => navigate("/explore")}
                >
                  Explore Events
                  <ArrowRight className="w-7 h-7 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
