import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAIMatch } from "../features/ai/aiThunk";
import heroImgAI from "../assests/hero_AI_match.png";
import {
  Astroid,
  Sparkles,
  Users,
  MapPinned,
  CalendarRange,
  Brain,
  Calendar,
  Heart,
} from "lucide-react";
import defultAvatar from "../assests/default_avatar.png";

export default function AiMatch() {
  const { status, error, matches } = useSelector((state) => state.ai);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMatch = () => {
    dispatch(getAIMatch());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div
        className="relatrive rounded-xl overflow-hidden h-[360px] mb-8"
        style={{
          backgroundImage: `url(${heroImgAI})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className=" relative z-10 flex flex-col justify-between h-full px-10 pb-6 pt-10">
          <div className="max-w-2xl mt-2">
            <h1 className="text font-bold text-orange-400 flex gap-4">
              <Astroid />
              AI MATCH
            </h1>
            <h1 className="text text-4xl font-bold text-primary">
              Smart connections,
              <p>real expreriences</p>
            </h1>
            <div className=" text-xl text-primary opacity-50 mt-4">
              <p>Our AI analuzes your interests to recommend</p>
              <p>people and events you'll trully enjoy</p>
            </div>
            <div className="card bg-base-200 border border-orange-400/10 mt-3 w-fit">
              <div className="card-body p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-orange-400 shrink-0" />

                  <div>
                    <h3 className="text-2xl font-semibold text-orange-400">
                      Personalized just for you
                    </h3>

                    <p className="text-lg opacity-70">
                      Based on your interests and activity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-5 pl-6">
        <h2 className="text-4xl font-bold text-center text-primary mb-5">
          How <span className="text-orange-400">AI</span> Match Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-base-200 border border-orange-400/10">
            <div className="card-body items-center text-center">
              <Brain className="w-16 h-16 text-orange-400 mt-1" />

              <h3 className="text-xl font-bold text-primary mt-4">
                Analyze Interests
              </h3>

              <p className="text-primary opacity-70">
                We learn what you enjoy and what matters to you.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 border border-orange-400/10">
            <div className="card-body items-center text-center">
              <Users className="w-16 h-16 text-green-400 mt-1" />

              <h3 className="text-xl font-bold text-primary mt-4">
                Find Compatible People
              </h3>

              <p className="text-primary opacity-70">
                We match you with people who share similar interests.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 border border-orange-400/10">
            <div className="card-body items-center text-center">
              <Calendar className="w-16 h-16 text-blue-400 mt-1" />

              <h3 className="text-xl font-bold text-primary mt-4">
                Recommend Events
              </h3>

              <p className="text-primary opacity-70">
                We suggest events that fit your lifestyle and preferences.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 border border-orange-400/10">
            <div className="card-body items-center text-center">
              <Heart className="w-16 h-16 text-purple-400 mt-1" />
              <h3 className="text-xl font-bold text-primary mt-4">
                Explain Why
              </h3>

              <p className="text-primary opacity-70">
                Every recommendation comes with a clear explanation.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-4 pl-20">
        <button
          className="btn border-none bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-[length:200%_auto] animate-pulse text-black text-2xl font-bold py-6 px-7 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform duration-300"
          onClick={handleMatch}
        >
          Find my Match with AI
        </button>
      </div>
      <div>
        {status === "loading" && <span className="loading loading-spinner" />}
        {status === "failed" && <p className="text-red-500">{error}</p>}
        {status === "succeeded" && matches && (
          <div className="grid gr2id-cols-2 gap-6 mt-6 pl-6">
            <div className="">
              <h2 className="text-xl font-bold text-primary mb-4 flex gap-2 pl-4">
                <Users className="w-8 h-8" />
                People you might click with
              </h2>
              {matches.recommendedUsers?.map((match) => (
                <div key={match.userId} className="card bg-base-200 mb-4">
                  <div className="card-body">
                    <div className="flex gap-6 items-start">
                      <img
                        src={
                          match.photo
                            ? `${import.meta.env.VITE_SERVER_URL}/uploads/${match.photo}`
                            : defultAvatar
                        }
                        alt={match.username}
                        className="w-32 h-40 rounded-xl border border-orange-400/20 object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-primary">
                          {match.username}
                        </h3>
                        <div className="mt-2">
                          {match.sharedInterests?.map((interest) => (
                            <span
                              key={interest}
                              className="badge bg-black/50 text-primary mr-1"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>

                        <p className="mt-4 text-primary opacity-60 leading-7 max-w-3xl">
                          {match.reason}
                        </p>
                      </div>
                      <div className="flex h-full shrink-0 flex-col items-end justify-center gap-4">
                        <div className="text-right">
                          <p className="text-5xl font-bold text-green-400">
                            {match.matchScore}%
                          </p>
                          <p className="text-xl text-white/70">Match</p>
                        </div>

                        <button
                          className="btn bg-orange-400 hover:bg-orange-300 text-black border-none rounded-xl px-6"
                          onClick={() => navigate(`/profile/${match.userId}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex gap-2 pl-4">
                <CalendarRange className="w-8 h-8" />
                Events perfect for you
              </h2>

              {matches.recommendedEvents.map((event) => (
                <div key={event.eventId} className="card bg-base-200 mb-3">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text text-primary font-bold text-xl">
                          {event.title}
                        </div>

                        <div className="text-primary opacity-50 mb-3">
                          {formatDate(event.event_start)}
                        </div>

                        <div className="text-primary flex gap-3 mt-1">
                          <MapPinned />
                          {event.place_name}
                        </div>

                        <div className="mt-3">
                          {event.matchedInterests.map((interest) => (
                            <span
                              key={interest}
                              className="badge bg-black/50 text-primary mr-1"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex h-full shrink-0 flex-col items-end justify-center gap-4">
                        <div className="text-right">
                          <p className="text-5xl font-bold text-green-400">
                            {event.matchScore}%
                          </p>
                          <p className="text-xl text-white/70">Match</p>
                        </div>

                        <button
                          className="btn bg-orange-400 hover:bg-orange-300 text-black border-none rounded-xl px-6"
                          onClick={() => navigate(`/event/${event.eventId}`)}
                        >
                          View Event
                        </button>
                      </div>
                    </div>
                    <div className="text-primary opacity-50 mt-3">
                      {event.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
