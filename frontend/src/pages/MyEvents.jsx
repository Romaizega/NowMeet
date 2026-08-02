import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyEvents } from "../features/events/eventThunk";
import EventsImgExplore from "../assests/defaultImgEvents.webp";
import {
  Users,
  MapPinned,
  CalendarDays,
  PencilLine,
  SquarePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import getStatusColor from "../utils/getStatusColor";

export default function MyEvents() {
  const { status, error, myEvents } = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMyEvents());
  }, [dispatch]);

  const handleViewEvent = (id) => {
    navigate(`/event/${id}`);
  };

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

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
      <div className="relative z-10 flex w-full min-h-screen items-start px-4 sm:px-6 lg:pl-14 lg:pr-6 pt-10 lg:pt-20">
        <div className="w-full xl:w-3/4 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                My Events
              </h1>
              <p className="text-primary text-base lg:text-xl opacity-50">
                Events you created and are managing
              </p>
            </div>
            <button
              className="btn btn-outline border-orange-351 text-orange-350 w-full sm:w-auto py-3 lg:py-6 px-5 lg:px-9 text-base lg:text-xl gap-3 lg:gap-4"
              onClick={() => navigate("/event/create")}
            >
              <SquarePlus className="w-5 h-5 " />
              Create an Event
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {myEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col lg:flex-row gap-4 bg-base-200 rounded-xl p-4"
              >
                <img
                  src={
                    event.cover_image
                      ? `/uploads/${event.cover_image}`
                      : EventsImgExplore
                  }
                  alt=""
                  className="w-full lg:w-48 h-48 sm:h-56 lg:h-36 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex flex-col flex-1 gap-2">
                  <span className={getStatusColor(event.status)}>
                    {event.status}
                  </span>
                  <h3 className="text-primary text-lg lg:text-xl font-bold">
                    {event.title}
                  </h3>
                  <p className="text-primary opacity-50 line-clamp-2 ">
                    {event.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 lg:gap-6 mt-2">
                    <span className="flex items-center gap-2 text-primary">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(event.event_start)}
                    </span>
                    <span className="flex items-center gap-2 text-primary">
                      <MapPinned className="w-4 h-4" />
                      {event.place_name}
                    </span>
                    <span className="flex items-center gap-2 text-primary">
                      <Users className="w-4 h-4" />
                      {event.max_participants} spots
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 justify-center w-full lg:w-auto">
                  <button
                    className="btn btn-outline border-orange-351 text-orange-350 w-full lg:w-auto gap-3 lg:gap-6 text-base lg:text-xl hover:bg-orange-400 hover:text-black py-3 lg:py-6"
                    type="button"
                    onClick={() => handleViewEvent(event.id)}
                  >
                    <PencilLine className="w-6 h-6" />
                    View Event
                  </button>
                </div>
              </div>
            ))}
          </div>
          {myEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <h2 className="text-3xl font-bold text-primary">No events yet</h2>
              <p className="text-primary opacity-60 text-lg mt-3 mb-8 max-w-lg leading-relaxed">
                Create your first event and start meeting amazing people around
                you
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
