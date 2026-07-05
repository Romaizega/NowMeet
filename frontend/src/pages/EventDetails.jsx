import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  joinToEvent,
  cancelEvent,
  updateEvent,
  deleteEventById,
} from "../features/events/eventThunk";
import {
  Calendar,
  Clock4,
  MapPin,
  Users,
  ChartPie,
  Handshake,
  MessageCircleMore,
  UserStar,
  PartyPopper,
  ExternalLink,
  PencilLine,
  Trash2,
  CircleX,
  CalendarSync,
  Building2 ,
  ArrowLeft,
} from "lucide-react";
import heroEventDetail from "../assests/hero_eventDetail.png";
import defultAvatar from "../assests/default_avatar.png";
import { getEventInterests } from "../features/interest/interestThunk";
import { clearUserInterest } from "../features/interest/interestSlice";
import EventMap from "../components/MapPicker";
import getStatusColor from "../utils/getStatusColor";

export default function EventDetails() {
  const { id } = useParams();
  const { status, error, currentEvent, participants } = useSelector(
    (state) => state.event,
  );
  const { eventInterest } = useSelector((state) => state.interest);
  const { user } = useSelector((state) => state.auth);
  const [showToast, setShowToast] = useState(false);
  const [localError, setLocalError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isJoined = participants?.some(
    (participant) => participant.id === user.id,
  );

  useEffect(() => {
    dispatch(getEventById(id));
    dispatch(getEventInterests(id));
    return () => {
      dispatch(clearUserInterest());
    };
  }, [dispatch, id]);

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;
  if (showToast)
    return (
      <div className="toast toast-top toast-center">
        <div className="alert alert-success">
          <span>Event deleted successfully!</span>
        </div>
      </div>
    );
  if (!currentEvent) return null;

  const isCreator = currentEvent.creator_id === user.id;
  const handleJoin = () => {
    dispatch(joinToEvent(id));
  };

  const handleLeaveEvent = () => {
    dispatch(cancelEvent(id));
  };

  const handleCancelEvent = () => {
    dispatch(updateEvent({ id, status: "cancelled" }));
  };
  const handleCloseEvent = () => {
    dispatch(updateEvent({ id, status: "closed" }));
  };

  const handleReopenEvent = () => {
    dispatch(updateEvent({ id, status: "open" }));
  };

  const handleDeleteEvent = async () => {
    try {
      await dispatch(deleteEventById(id)).unwrap();
      setShowToast(true);
      setTimeout(() => navigate("/explore"), 2000);
    } catch (error) {
      setLocalError("Failed to delete event", error);
    }
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
      {/* Hero */}
      <div
        className="relative rounded-xl overflow-hidden mb-6 h-[420px] "
        style={{
          backgroundImage: `url(${
            currentEvent.cover_image
              ? `/uploads/${currentEvent.cover_image}`
              : heroEventDetail
          })`,
          backgroundSize: "contain",
          backgroundPosition: "97% center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="relative z-10 flex flex-col justify-between h-full px-10 pb-6 pt-10">
          <div>
            <button
              className="btn btn-ghost text-xl"
              onClick={() => navigate("/explore")}
            >
              <ArrowLeft />
              Back to Events
            </button>
          </div>
          <div className="max-w-2xl mt-2">
            <span className={getStatusColor(currentEvent.status)}>
              {currentEvent.status}
            </span>
            <h2 className="text text-4xl text-primary font-bold mt-">
              {currentEvent.title}
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 ">
              <span className="flex items-center gap-2">
                <Calendar className="w-12 h-12 " />
                <span className="text-primary text-xl">
                  {formatDate(currentEvent.event_start)}
                  <p className="opacity-50">Start</p>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Clock4 className="w-12 h-12" />
                <span className="text-primary text-xl">
                  {currentEvent.duration} min
                  <p className="opacity-50">Duration</p>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Building2  className="w-12 h-12" />
                <span className="text-primary text-xl">
                  {currentEvent.city}
                  <p className="opacity-50">City</p>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-12 h-12" />
                <span className="text-primary text-xl">
                  {currentEvent.place_name}
                  <p className="opacity-50">Place</p>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-12 h-12" />
                <span className="text-primary text-xl">
                  {participants?.length}/{currentEvent.max_participants}
                  <p className="opacity-50">Going</p>
                </span>
              </span>
              <button
                className="btn btn-outline border-orange-351 px-10 py-6 text-primary gap-6 text-xl hover:bg-orange-400 hover:text-black"
                onClick={() => navigate(`/event/${id}/common-chat`)}
              >
                <MessageCircleMore />
                Chat
              </button>
            </div>
          </div>
          {isCreator ? (
            <div className="flex gap-3">
              <button
                className="btn btn-outline border-orange-351 px-10 py-6 text-orange-350 gap-6 text-xl hover:bg-orange-400 hover:text-black"
                type="button"
                onClick={() => navigate(`/event/${id}/edit`)}
              >
                {" "}
                <PencilLine className="w-6 h-6" />
                Edit Event
              </button>

              {currentEvent.status === "open" && (
                <>
                  <button
                    className="btn btn-outline border-orange-351 px-10 py-6 text-orange-350 gap-6 text-xl hover:bg-orange-400 hover:text-black"
                    type="button"
                    onClick={handleCloseEvent}
                  >
                    <CalendarSync className=" w-7 h-7" />
                    Close Event
                  </button>
                  <button
                    className="btn btn-outline border-error px-10 py-6 text-error gap-6 text-xl hover:bg-orange-400 hover:text-black"
                    type="button"
                    onClick={handleCancelEvent}
                  >
                    <CircleX className="w-7 h-7" />
                    Cancel Event
                  </button>
                </>
              )}
              {currentEvent.status === "cancelled" && (
                <button
                  className="btn btn-outline border-orange-351 px-10 py-6 text-orange-350 gap-6 text-xl hover:bg-orange-400 hover:text-black"
                  type="button"
                  onClick={handleReopenEvent}
                >
                  Reopen Event
                </button>
              )}
              {currentEvent.status === "closed" && (
                <button
                  className="btn btn-outline border-orange-351 px-10 py-6 text-orange-350 gap-6 text-xl hover:bg-orange-400 hover:text-black"
                  type="button"
                  onClick={handleReopenEvent}
                >
                  Reopen Registration
                </button>
              )}

              <button
                className="btn btn-outline border-error px-10 py-6 text-error gap-6 text-xl hover:bg-orange-400 hover:text-black"
                type="button"
                onClick={handleDeleteEvent}
              >
                <Trash2 />
                Delete Event
              </button>
            </div>
          ) : (
            <button
              className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-2xl px-2 py-2 mr-500 "
              type="button"
              onClick={isJoined ? handleLeaveEvent : handleJoin}
            >
              <span className="text-xl">
                {isJoined ? "Leave MeetUp" : "Join Meetup"}
              </span>
            </button>
          )}
        </div>
      </div>

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
          <div className="flex flex-col gap-6">
            {/* Right column — Interests, etc */}
            <div className="bg-base-200 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-2">
                Interests
              </h3>
              {eventInterest && eventInterest.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {eventInterest.map((interest) => (
                    <span
                      key={interest.id}
                      className=" text-primary badge rounded-full border border-orange-400 px4 py-4"
                    >
                      {interest.name}
                    </span>
                  ))}{" "}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6">
                  <p className="text-primary">No interests yet</p>
                </div>
              )}{" "}
            </div>
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
                    ? `/uploads/${currentEvent.creator_photo}`
                    : defultAvatar
                }
                alt={currentEvent.creator_username}
                className="w-30 h-30 rounded-full border-2 border-white object-cover cursor-pointer transition-transform duration-300 hover:scale-210"
                title={currentEvent.creator_username}
              />
              <div>
                <p className="text-primary text-xl font-bold">
                  {currentEvent.creator_username}
                </p>
                <p className="text-primary text-xl opacity-50">
                  {currentEvent.creator_about}
                </p>
                <button
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-2xl px-6 py-6"
                  onClick={() =>
                    navigate(`/profile/${currentEvent.creator_user_id}`)
                  }
                >
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
            {participants?.length > 0 ? (
              <div className="flex gap-2 mt-3">
                {participants.map((participant) => (
                  <img
                    key={participant.id}
                    src={
                      participant.photo
                        ? `/uploads/${participant.photo}`
                        : defultAvatar
                    }
                    alt={participant.username}
                    className="w-17 h-17 rounded-full border-2 border-white object-cover cursor-pointer transition-transform duration-300 hover:scale-210"
                    title={participant.username}
                    onClick={() => navigate(`/profile/${participant.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <Users className="w-12 h-12 opacity-50" />
                <p className="text-primary font-bold">No participants yet.</p>
                <p className="text-primary opacity-50">Be the first to join!</p>
                <button
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-2xl px-8 py-7"
                  type="button"
                  onClick={handleJoin}
                >
                  <span className="text-xl">Join Meetup</span>
                </button>
              </div>
            )}
          </div>
          {/* Event details */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text text-2xl font-bold text-orange-400">
              {" "}
              Event details
            </h3>
            <div className="flex items-center gap-4 text-primary">
              <div className="grid grid-cols-2 gap-4 mt-4 text-primary">
                <span className="flex items-center gap-2  border-b border-gray-700 pb-4">
                  <Calendar className="w-7 h-7" />
                  Date & Time
                </span>
                <span className="border-b border-gray-700 pb-4">
                  {" "}
                  {formatDate(currentEvent.event_start)}
                </span>

                <span className="flex items-center gap-2 border-b border-gray-700 pb-4">
                  <Clock4 className="w-7 h-7" />
                  Duration
                </span>
                <span className="border-b border-gray-700 pb-4">
                  {currentEvent.duration} minutes{" "}
                </span>

                <span className="flex items-center gap-2 border-b border-gray-700 pb-4">
                  <Users className="w-7 h-7" />
                  Max Participants
                </span>
                <span className="border-b border-gray-700 pb-4">
                  {currentEvent.max_participants}
                </span>

                <span className="flex items-center gap-2  border-b border-gray-700 pb-4">
                  <ChartPie className="w-7 h-7" />
                  Event Status
                </span>
                <span className="flex items-center border-b border-gray-700 pb-4">
                  <span className="badge border-green-400 bg-black/50 text-green-300 uppercase">
                    {currentEvent.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column*/}
        <div className="flex flex-col gap-6">
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text text-xl font-bold text-orange-400">Location</h3>
            <p className="text-primary mt-6">{currentEvent.place_name}</p>
            <EventMap
              lat={currentEvent.latitude}
              lng={currentEvent.longitude}
              readonly={true}
            ></EventMap>
            <a
              href={`https://www.google.com/maps?q=${currentEvent.latitude},${currentEvent.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black w-full flex items-center justify-center gap-2 mt-4"
            >
              <ExternalLink className="w-5 h-5" />
              Open in Google Maps
            </a>
          </div>
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text text-xl font-bold text-orange-400">
              What to expect
            </h3>
            <span className="flex items-center gap-2 mt-4">
              <Handshake className="h-10 w-10 text-primary" />
              <span className="text-primary text-xl">
                {" "}
                Meet New People
                <p className="opacity-50">Connect and build new friendships</p>
              </span>
            </span>
            <span className="flex items-center gap-2 mt-4">
              <MessageCircleMore className="w-12 h-12 text-primary" />
              <span className="text-primary text-xl">
                Great Conversations
                <p className="opacity-50 ">
                  Share ideas and meaningful discussions
                </p>
              </span>
            </span>
            <span className="flex items-center gap-2 mt-4">
              <UserStar className="w-12 h-12 text-primary" />
              <span className="text-primary text-xl">
                New Experiences
                <p className="opacity-50 ">
                  Try something new and explore together
                </p>
              </span>
            </span>
            <span className="flex items-center gap-2 mt-4">
              <PartyPopper className="w-12 h-12 text-primary" />
              <span className="text-primary text-xl">
                Relaxed Atmosphere
                <p className="opacity-50 ">
                  Friendly, welcoming, and pressure-free
                </p>
              </span>
            </span>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Event deleted successfully!</span>
          </div>
        </div>
      )}
    </>
  );
}
