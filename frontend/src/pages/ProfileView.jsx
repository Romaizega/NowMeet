import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { profileView, getUserEvents } from "../features/profile/profileThunk";
import { getUserInterests } from "../features/interest/interestThunk";
import heroProfileView from "../assests/hero_profileview.webp";
import defultAvatar from "../assests/default_avatar.webp";
import { clearPublicProfile } from "../features/profile/profileSlice";
import { clearUserInterest } from "../features/interest/interestSlice";
import { MessageCircleMore } from "lucide-react";
import EventsImgExplore from "../assests/defaultImgEvents.webp";
import { MapPinned } from "lucide-react";
import getStatusColor from "../utils/getStatusColor";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
export default function ProfileView() {
  const { id } = useParams();
  const { status, error, publicProfile, userEvents } = useSelector(
    (state) => state.profile,
  );

  const { userInterest } = useSelector((state) => state.interest);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [opneImage, setOpenImage] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(profileView(id));
    dispatch(getUserEvents(id));
    dispatch(getUserInterests(id));
    return () => {
      dispatch(clearPublicProfile());
      dispatch(clearUserInterest());
    };
  }, [dispatch, id]);

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;
  if (!publicProfile) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Hero background */}
      <div
        className="relative rounded-xl overflow-hidden h-[260px] sm:h-[300px] lg:h-[350px] mb-8 lg:mb-10"
        style={{
          backgroundImage: `url(${heroProfileView})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Profile info */}
      <div className="relative -mt-24 sm:-mt-32 lg:-mt-50 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-8 lg:gap-15">
          {/* Avatar */}
          <img
            src={
              publicProfile.photo
                ? `/uploads/${publicProfile.photo}`
                : defultAvatar
            }
            alt={publicProfile.username}
            className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-orange-400 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setOpenImage(true)}
          />
          {opneImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setOpenImage(false)}
            >
              <div className="relative max-w-3xl max-h-[90vh] p-2">
                <button
                  className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
                  onClick={() => setOpenImage(false)}
                >
                  <span className="">X</span>
                </button>
                <img
                  src={
                    publicProfile.photo
                      ? `/uploads/${publicProfile.photo}`
                      : defultAvatar
                  }
                  alt={publicProfile.username}
                  className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl animate-fade-in"
                />
              </div>
            </div>
          )}
          {/* Name and info */}
          <div className="pb-2 text-center sm:text-left w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <h2 className="text-2xl lg:text-3xl text-primary font-bold break-words">
                  {publicProfile.username}
                </h2>
                <span className="badge bg-orange-500 text-white border-none mt-2">
                  Member
                </span>
              </div>
              <button
                className="btn btn-outline border-orange-351 w-full sm:w-auto px-6 lg:px-10 py-3 lg:py-6 text-primary gap-5 lg:gap-8 text-base lg:text-xl hover:bg-orange-400 hover:text-black"
                onClick={() => navigate(`/profile/${id}/private-chat`)}
              >
                <MessageCircleMore />
                Chat
              </button>
            </div>
            <p className="text-primary opacity-50 text-sm mt-4 lg:mt-10">
              Member since {formatDate(publicProfile.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 px-4 sm:px-6 lg:px-10">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {/* About Me */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-orange-400 text-2xl font-bold mb-3">
              About Me
            </h3>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
              <span className="text-orange-400 text-base lg:text-xl ">
                Name:
              </span>
              <p className="text-primary text-base lg:text-xl break-words">
                {publicProfile.first_name || publicProfile.last_name
                  ? `${publicProfile.first_name || ""} ${publicProfile.last_name || ""}`
                  : "Name not provided"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
              <span className="text-orange-400 text-base lg:text-xl ">
                Country:
              </span>
              <p className="text-primary text-base lg:text-xl break-words">
                {publicProfile.country}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
              <span className="text-orange-400 text-base lg:text-xl ">
                City:
              </span>
              <p className="text-primary text-base lg:text-xl break-words">
                {publicProfile.city}
              </p>
            </div>
            <p className="text-primary lg:text-xl break-words mt-3">
              {publicProfile.about || "This user hasn't written a bio yet"}
            </p>
          </div>
          <div className="bg-base-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-orange-400 text-xl sm:text-2xl font-bold">
                Events Created ({userEvents.length})
              </h3>
              {userEvents.length > 4 && (
                <button
                  type="button"
                  className="text-orange-400 text-sm sm:text-base font-semibold whitespace-nowrap hover:opacity-70 transition-opacity"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show less ←" : "View all →"}
                </button>
              )}
            </div>

            {userEvents.length === 0 ? (
              <p className="text-primary opacity-50">No events yet</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:overflow-visible">
                {(showAll ? userEvents : userEvents.slice(0, 4)).map(
                  (event) => (
                    <div
                      key={event.id}
                      className="min-w-[260px] sm:min-w-[300px] lg:min-w-0 flex flex-col bg-base-300 rounded-xl overflow-hidden cursor-pointer border border-primary/10 hover:border-orange-400 transition-all snap-start"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      <span className={getStatusColor(event.status)}>
                        {event.status}
                      </span>
                      <img
                        src={
                          event.cover_image
                            ? `/uploads/${event.cover_image}`
                            : EventsImgExplore
                        }
                        alt={event.title}
                        className="w-full h-32 sm:h-36 object-cover"
                      />
                      <div className="flex flex-col flex-1 p-4">
                        <h4 className="text-primary text-base sm:text-lg font-bold line-clamp-2 min-h-12">
                          {event.title}
                        </h4>
                        <div className="flex items-center justify-between gap-3 mt-4">
                          <div className="flex items-center gap-1 text-primary opacity-60 text-sm truncate">
                            <MapPinned className="w-4 h-4 shrink-0" />
                            <span>
                              {event.city}, {event.country}
                            </span>
                          </div>
                          <p className="text-orange-400 text-sm font-semibold whitespace-nowrap">
                            {formatDate(event.created_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black text-sm mt-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/${event.id}`);
                        }}
                      >
                        View Event
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {/* Right column — Interests, etc */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-orange-400 mb-2">
              Interests
            </h3>
            {userInterest && userInterest.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userInterest.map((interest) => (
                  <span
                    key={interest.id}
                    className=" text-primary badge rounded-full border border-orange-400 px-3 py-3 lg:py-4"
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
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">
              Social Media
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl bg-base-300 py-5 border border-transparent hover:border-orange-400 hover:bg-base-100 transition-all"
              >
                <FaInstagram className="text-3xl text-orange-400" />
                <span className="text-xs text-primary">Instagram</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl bg-base-300 py-5 border border-transparent hover:border-orange-400 hover:bg-base-100 transition-all"
              >
                <FaFacebook className="text-3xl text-orange-400" />
                <span className="text-xs text-primary">Facebook</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl bg-base-300 py-5 border border-transparent hover:border-orange-400 hover:bg-base-100 transition-all"
              >
                <FaLinkedin className="text-3xl text-orange-400" />
                <span className="text-xs text-primary">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
