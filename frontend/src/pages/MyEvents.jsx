import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyEvents, updateEvent } from "../features/events/eventThunk";
import EventsImgExplore from "../assests/defaultImgEvents.png";
import {
  Users,
  MapPinned,
  CalendarDays,
  PencilLine,
  Ban,
  SquarePlus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import getStatusColor from "../utils/getStatusColor";

export default function MyEvents() {
  const { status, error, myEvents } = useSelector((state) => state.event);
  const dispatrch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatrch(getMyEvents());
  }, [dispatrch]);

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
      <div className="relative z-10 flex w-full min-h-screen items-start pl-14 pt-20">
        <div className="w-full lg:w-3/4 text left">
          <div className="flex justify-between items-center mt-3">
            <div>
              <h1 className="text lg:text-5xl font-bold text-primary">
                My Events
              </h1>
              <p className="text-primary text-xl opacity-50">
                Events you created and are managing
              </p>
            </div>
            <button
              className="btn btn-outline border-orange-351 text-orange-350 py-6 px-9 text-xl gap-4"
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
                className="flex gap-4 bg-base-200 rounded-xl p-4"
              >
                <img
                  src={
                    event.cover_image
                      ? `/uploads/${event.cover_image}`
                      : EventsImgExplore
                  }
                  alt=""
                  className="w-48 h-36 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex flex-col flex-1 gap-2">
                  <span className={getStatusColor(event.status)}>
                    {event.status}
                  </span>
                  <h3 className="text-primary text-xl font-bold">
                    {event.title}
                  </h3>
                  <p className="text-primary opacity-50 line-clamp-2 ">{event.description}</p>
                  <div className="flex gap-6 mt-2">
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

                <div className="flex flex-col gap-2 justify-center">
                  <button
                    className="btn btn-outline border-orange-351 text-orange-350 gap-6 text-xl hover:bg-orange-400 hover:text-black py-6"
                    type="button"
                    onClick={() => handleViewEvent(event.id)}
                  >
                    <PencilLine className="w-6 h-6" />
                    View Event
                  </button>
                  {/* <button
                    className="btn btn-outline border-error text-error gap-4 text-xl hover:bg-orange-400 hover:text-black mt-3 py-6"
                    type="button"
                    onClick={async () => {
                      await dispatrch(
                        updateEvent({ id: event.id, status: "cancelled" }),
                      ).unwrap();
                      dispatrch(getMyEvents());
                    }}
                  >
                    <Ban className="w-6 h-6 text-error" />
                    Cancel Event
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
