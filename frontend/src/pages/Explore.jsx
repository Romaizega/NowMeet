import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEvents } from "../features/events/eventThunk";
import { useNavigate } from "react-router-dom";
import heroImgExplore from "../assests/hero_explore.png";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, events } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* <div className="hero min-h-[420] bg-cover bg-center"
    style={{backgroundImage: `url(${heroImgExplore})`}}> */}

      <div className="relative z-10 flex w-full min-h-screen items-start pl-16 pt-24">
        <div className="w-full lg:w-3/4 text-left">
          <h1 className="text-5xl lg:text-3xl font-bold leading-tight text-primary">
            Events
          </h1>
          <p className="text-sm tracking-widest  text-primary mb-4">
            Discover exciting meetups happening around you
          </p>
          <div className="grid grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id}>
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-primary">Title</h2>
                    <p>{event.title}</p>

                    <h2 className="card-title text-primary">Description</h2>
                    <p>{event.description}</p>

                    <h2 className="card-title text-primary">Name</h2>
                    <p>{event.place_name}</p>

                    <h2 className="card-title text-primary">Start</h2>
                    <p>{formatDate(event.event_start)}</p>

                    <h2 className="card-title text-primary">Duration</h2>
                    <p>{event.duration} min</p>

                    <h2 className="card-title text-primary">Paricipants</h2>
                    <p>{event.max_participants} </p>

                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
