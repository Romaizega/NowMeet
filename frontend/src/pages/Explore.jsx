import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEvents } from "../features/events/eventThunk";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPinned,
  CalendarDays,
  Search,
  PencilLine ,
} from "lucide-react";
import EventsImgExplore from "../assests/defaultImgEvents.png";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, events, participants } = useSelector(
    (state) => state.event,
  );

  const [searchEvents, setSearchEvents] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchEvents.toLowerCase()),
    )
    .filter((event) =>
      statusFilter === "all" ? true : event.status === statusFilter,
    );

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

  const handleStatusCange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <>
      <div className="relative z-10 flex w-full min-h-screen items-start pl-14 pt-20">
        <div className="w-full lg:w-3/4 text-left">
          <h1 className="text lg:text-5xl font-bold leading-tight text-primary">
            Events
          </h1>
          <p className="text-sm tracking-widest  text-primary text-xl mb-4 opacity-50">
            Discover exciting meetups happening around you
          </p>
          <div className="flex flex-col-2 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white z-10" />
              <input
                type="text"
                className="input input-bordered input-primary w-full max-w-xl text-xl text-primary pl-10"
                value={searchEvents}
                onChange={(e) => setSearchEvents(e.target.value)}
                placeholder="Search events..."
              />
            </div>
            <div>
              <select
                name="status"
                value={statusFilter}
                onChange={handleStatusCange}
                className="select select-bordered w-70 select-primary text-primary text-2xl"
              >
                <option value="open">all</option>
                <option value="open">open</option>
                <option value="cancelled">cancelled</option>
                <option value="closed">closed</option>
                <option value="expired">expired</option>
              </select>
            </div>
            <button
              className="flex items-center gap-4 rounded-xl border border-white bg-black/40 px-14 text-primary text-xl transition-all hover:bg-white-400 hover:text-white"
            onClick={() => navigate('/event/create')}
            >
              <PencilLine  className="w-7 h-7 text-primary"  />
              Create Event
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-3">
            {filteredEvents.map((event) => (
              <div key={event.id}>
                <div className="card bg-base-200 shadow-xl">
                  <span className="badge border-white bg-black/50 text-green-400 uppercase text-xl absolute ">
                    {event.status}
                  </span>
                  <img src={EventsImgExplore} alt="" className="w-170 h-120" />
                  <div className="card-body">
                    <p className="text text-xl text-primary font-bold">
                      {event.title}
                    </p>
                    <p className="text-primary opacity-50 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <MapPinned className="w-8 h-8" />
                      <p className="text-primary text-xl">{event.place_name}</p>
                      <CalendarDays className="w-8 h-8" />
                      <p className="text-primary text-xl">
                        {formatDate(event.event_start)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="flex items-center gap-4">
                        <Users className="w-8 h-8" />
                        <span className="text text-xl text-primary">
                          {event.max_participants} spots
                        </span>
                      </span>
                    </div>

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
    </>
  );
}
