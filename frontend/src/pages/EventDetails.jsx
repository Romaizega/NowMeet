import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getEventById,
  joinToEvent,
  cancelEvent,
} from "../features/events/eventThunk";
import { Calendar, Clock4, MapPin, Users, ChartPie  } from "lucide-react";
import heroEventDetail from "../assests/hero_eventDetail.png";
import defultAvatar from "../assests/default_avatar.png";

export default function EventDetails() {
  const { id } = useParams();
  const { status, error, currentEvent, participants } = useSelector(
    (state) => state.event,
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isJoined = participants?.some(
    (participant) => participant.id === user.id,
  );

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;
  if (!currentEvent) return null;

  const handleJoin = () => {
    dispatch(joinToEvent(id));
  };

  const handleCancel = () => {
    dispatch(cancelEvent(id));
  };

  const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

  return (
    <>
      {/* Hero */}
      <div
        className="relative rounded-xl overflow-hidden mb-2 h-[320px]"
        style={{
          backgroundImage: `url(${heroEventDetail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 flex flex-col justify-between h-full px-10 pb-6 pt-10">
          <div className="max-w-xl">
            <span className="badge border-orange-400 bg-black/50 text-orange-300 uppercase">
              {currentEvent.status}
            </span>
            <h2 className="text text-3xl text-primary font-bold mt-6">
              {currentEvent.title}
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-primary">
              <span className="flex items-center gap-2">
                <Calendar className="w-7 h-7" />
                {formatDate(currentEvent.event_start)}
              </span>
              <span className="flex items-center gap-2">
                <Clock4 className="w-7 h-7" />
                {currentEvent.duration}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-7 h-7" />
                {currentEvent.place_name}
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-7 h-7" />
                {currentEvent.max_participants}
              </span>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              onClick={isJoined ? handleCancel : handleJoin}
            >
              {isJoined ? "Cancel" : "Join Meetup"}
            </button>
          </div>
        </div>
      </div>

      {/* Контент — один grid */}
      <div className="grid grid-cols-3 gap-6 mt-6 px-10">
        {/* Left column */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* About */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-orange-400 text-xl font-bold mb-3">
              About this meetup
            </h3>
            <p className="text-primary text-xl">{currentEvent.description}</p>
          </div>

          {/* Hosted by */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-orange-400 text-xl font-bold mb-3">
              Hosted by
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={
                  currentEvent.creator_photo
                    ? `${import.meta.env.VITE_SERVER_URL}/uploads/${currentEvent.creator_photo}`
                    : defultAvatar
                }
                alt={currentEvent.creator_username}
                className="w-20 h-25 rounded-full border-2 border-white"
                title={currentEvent.creator_username}
              />
              <div>
                <p className="text-primary text-xl font-bold">
                  {currentEvent.creator_username}
                </p>
                <p className="text-primary text-xl opacity-50">{currentEvent.creator_about}</p>
                <button className="btn btn" type="button">
                  View profile
                </button>
              </div>
            </div>
          </div>

          {/* Going */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text text-2xl font-bold text-orange-400">
              Going ({participants?.length})
            </h3>
            <div className="flex gap-2 mt-3">
              {participants.map((participant) => {
                return (
                  <img
                    key={participant.id}
                    src={
                      participant.photo
                        ? `${import.meta.env.VITE_SERVER_URL}/uploads/${participant.photo}`
                        : defultAvatar
                    }
                    alt={participant.username}
                    className="w-17 h-17 rounded-full border-2 border-white"
                    title={participant.username}
                  />
                );
              })}
            </div>
          </div>
          {/* Event details */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text text-2xl font-bold text-orange-400">
              {" "}
              Event details
            </h3>
            <div className="flex items-center gap-4 text-primary">
              <div>
                <span className="flex items-center gap-2 mt-2">
                  <Calendar className="w-7 h-7" />
                  <p>Date & Time</p>
                  {formatDate(currentEvent.event_start)}
                </span>
                <span className="flex items-center gap-2 mt-4">
                <Clock4 className="w-7 h-7" />
                <p>Duration</p>
                {currentEvent.duration} <p>minutes</p>
              </span>
              <span className="flex items-center gap-2 mt-4">
                <Users className="w-7 h-7" />
                <p>Max Participants</p>
                {currentEvent.max_participants}
              </span>
              <span className="flex items-center gap-2 mt-4">
                <ChartPie  className="w-7 h-7" />
                <p>Event Status</p>
                <span className="badge border-green-400 bg-black/50 text-green-300 uppercase">
                {currentEvent.status}
                </span>
              </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column*/}
        <div className="flex flex-col gap-6"></div>
      </div>
    </>
  );
}
