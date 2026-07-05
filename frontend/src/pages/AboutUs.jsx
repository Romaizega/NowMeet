import {
  Users,
  CalendarDays,
  Globe,
  Heart,
  ShieldCheck,
} from "lucide-react";

import communityImg from "../assests/community.png";

export default function AboutUs() {
  return (
    <>
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-14 pt-20">
        <div className="w-full text-left">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-primary">
                About <span className="text-orange-400">NowMeet</span>
              </h1>

              <p className="text-primary text-lg lg:text-2xl opacity-70 mt-6 leading-relaxed max-w-3xl opacity-70 mt-6 leading-relaxed max-w-3xl">
                NowMeet is a community-driven platform that brings people
                together through shared interests and real-life experiences
              </p>

              <div className="grid grid-cols-2 lg:flex gap-8 lg:gap-10 mt-10">
                <div>
                  <Users className="w-12 h-12 text-primary mb-3" />
                  <p className="text-3xl lg:text-4xl font-bold text-primary">10K+</p>
                  <p className="text-xl text-primary opacity-50">Members</p>
                </div>

                <div className="lg:border-l lg:border-orange-400/20 lg:pl-10">
                  <CalendarDays className="w-12 h-12 text-primary mb-3" />
                  <p className="text-3xl lg:text-4xl font-bold text-primary">2K+</p>
                  <p className="text-xl text-primary opacity-50">
                    Events Created
                  </p>
                </div>

                <div className="border-l border-orange-400/20 pl-10">
                  <Globe className="w-12 h-12 text-primary mb-3" />
                  <p className="text-3xl lg:text-4xl font-bold text-primary">40+</p>
                  <p className="text-xl text-primary opacity-50">Countries</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={communityImg}
                alt="NowMeet community"
                className="w-full max-w-sm md:max-w-lg lg:max-w-3xl object-contain mx-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-16">
            <div className="card bg-base-200 shadow-xl border border-orange-400/10 hover:border-orange-400/40 transition-all">
              <div className="card-body">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black/40 border border-orange-400/30 flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-xl lg:text-2xl font-bold text-primary">
                  Our Mission
                </h2>

                <p className="text-primary text-lg opacity-60 leading-relaxed">
                  Connect people by creating meaningful experiences and helping
                  communities grow stronger together
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl border border-orange-400/10 hover:border-orange-400/40 transition-all">
              <div className="card-body">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black/40 border border-orange-400/30 flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-xl lg:text-2xl font-bold text-primary">
                  Our Vision
                </h2>

                <p className="text-primary text-lg opacity-60 leading-relaxed">
                  A world where everyone can easily find their people and turn
                  shared interests into real connections
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl border border-orange-400/10 hover:border-orange-400/40 transition-all">
              <div className="card-body">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black/40 border border-orange-400/30 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-xl lg:text-2xl font-bold text-primary">
                  Our Values
                </h2>

                <ul className="text-primary text-lg opacity-60 leading-relaxed list-disc pl-5">
                  <li>Community First</li>
                  <li>Respect & Inclusivity</li>
                  <li>Authentic Connections</li>
                  <li>Safety & Trust</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl border border-orange-400/10 hover:border-orange-400/40 transition-all">
              <div className="card-body">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black/40 border border-orange-400/30 flex items-center justify-center mb-6">
                  <Globe className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-xl lg:text-2xl font-bold text-primary">
                  Our Community
                </h2>

                <p className="text-primary text-lg opacity-60 leading-relaxed">
                  Diverse people, unique interests, and endless opportunities
                  to meet, learn, and grow
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}