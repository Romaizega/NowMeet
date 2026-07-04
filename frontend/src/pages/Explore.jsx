import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEvents } from "../features/events/eventThunk";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPinned,
  CalendarDays,
  Search,
  PencilLine,
  Road,
} from "lucide-react";
import EventsImgExplore from "../assests/defaultImgEvents.png";
import getStatusColor from "../utils/getStatusColor";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, events, participants, pagination } = useSelector(
    (state) => state.event,
  );

  const [searchEvents, setSearchEvents] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");
  const [page, setPage] = useState(1);
  const [debouncedCity, setDebouncedCity] = useState("")
  const [debouncedCountry, setDebouncedCountry] = useState("")
  const [city, setCity] = useState("");
  const [country, setCounrty] = useState("");
  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchEvents.toLowerCase()),
    )
    .filter((event) =>
      statusFilter === "all" ? true : event.status === statusFilter,
    );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city)
      setDebouncedCountry(country)     
    }, 5000)
    return () => clearTimeout(timer)
  },  [city, country])

  useEffect(() => {
    dispatch(getAllEvents({ page, city:debouncedCity, country: debouncedCountry }));
  }, [dispatch, page, debouncedCity, debouncedCountry]);

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
      <div className="relative z-10 w-full min-h-screen px-14 pt-20">
        <div className="w-full text-left">
          <h1 className="text lg:text-5xl font-bold leading-tight text-primary">
            Events
          </h1>

          <p className="text-sm tracking-widest text-primary text-xl mb-4 opacity-50">
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
              <input
                type="text"
                placeholder="country..."
                value={country}
                onChange={(e) => {
                  setCounrty(e.target.value);
                  setPage(1);
                }}
                className="input input-bordered input-primary w-full max-w-xl text-xl text-primary pl-10"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="city..."
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="input input-bordered input-primary w-full max-w-xl text-xl text-primary pl-10"
              />
            </div>

            <div>
              <select
                name="status"
                value={statusFilter}
                onChange={handleStatusCange}
                className="select select-bordered w-70 select-primary text-primary text-2xl "
              >
                <option value="open">open</option>
                <option value="cancelled">cancelled</option>
                <option value="closed">closed</option>
                <option value="expired">expired</option>
                <option value="open">all</option>
              </select>
            </div>

            <button
              className="flex items-center gap-4 rounded-xl border border-white bg-black/40 px-14 text-primary text-xl transition-all hover:bg-white-400 hover:text-white"
              onClick={() => navigate("/event/create")}
            >
              <PencilLine className="w-7 h-7 text-primary" />
              Create Event
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-3 w-full mt-2">
            {filteredEvents.map((event) => (
              <div key={event.id}>
                <div className="card bg-base-200 shadow-xl overflow-hidden relative h-full mt-2">
                  <span
                    className={`${getStatusColor(event.status)} absolute top-3 left-3 z-20`}
                  >
                    {event.status}
                  </span>

                  <img
                    src={
                      event.cover_image
                        ? `${import.meta.env.VITE_SERVER_URL}/uploads/${event.cover_image}`
                        : EventsImgExplore
                    }
                    alt=""
                    className="w-full h-96 object-cover"
                  />

                  <div className="card-body">
                    <p className="text text-xl text-primary font-bold">
                      {event.title}
                    </p>

                    <p className="text-primary text-lg opacity-50 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex  gap-2">
                      <MapPinned className="w-8 h-8" />
                      <p className="text-primary text-xl">
                        {event.country} {event.city}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Road className="w-8 h-8" />
                      <p className="text-primary text-xl">{event.place_name}</p>
                    </div>
                    <div className="flex gap-2 ">
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
          <div className=" join flex justify-center gap-4 mt-5 text-primary w-full">
            {Array.from({ length: pagination.totalPages }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <input
                  key={pageNumber}
                  type="radio"
                  name="pagination-options"
                  aria-label={pageNumber.toString()}
                  className="join-item btn btn-square"
                  checked={pagination.page === pageNumber}
                  onChange={() => setPage(pageNumber)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
