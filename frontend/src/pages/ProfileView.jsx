import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  profileView,
  getUserInterests,
} from "../features/profile/profileThunk";
import heroProfileView from "../assests/hero_profileview.png";
import defultAvatar from "../assests/default_avatar.png";
import { clearPublicProfile } from "../features/profile/profileSlice";

export default function ProfileView() {
  const { id } = useParams();
  const { status, error, publicProfile, userInterests } = useSelector(
    (state) => state.profile,
  );
  const dispatch = useDispatch();
  const [opneImage, setOpenImage] = useState(false);

  useEffect(() => {
    dispatch(profileView(id));
    dispatch(getUserInterests(id));
    return () => {
      dispatch(clearPublicProfile());
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
        className="relative rounded-xl overflow-hidden h-[350px] mb-10"
        style={{
          backgroundImage: `url(${heroProfileView})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Profile info */}
      <div className="relative -mt-50 px-10">
        <div className="flex items-end gap-15">
          {/* Avatar */}
          <img
            src={
              publicProfile.photo
                ? `${import.meta.env.VITE_SERVER_URL}/uploads/${publicProfile.photo}`
                : defultAvatar
            }
            alt={publicProfile.username}
            className="w-36 h-36 rounded-full border-4 border-orange-400 object-cover cursor-pointer hover:opacity-90 transition-opacity"
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
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/${publicProfile.photo}`
                      : defultAvatar
                  }
                  alt={publicProfile.username}
                  className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl animate-fade-in"
                />
              </div>
            </div>
          )}
          {/* Name and info */}
          <div className="pb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl text-primary font-bold">
                {publicProfile.username}
              </h2>
              <span className="badge bg-orange-500 text-white border-none">
                Member
              </span>
            </div>
            <p className="text-primary opacity-50 text-sm mt-10">
              Member since {formatDate(publicProfile.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-3 gap-6 mt-8 px-10">
        <div className="col-span-2 flex flex-col gap-6">
          {/* About Me */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-orange-400 text-2xl font-bold mb-3">
              About Me
            </h3>
            <div className="flex gap-2 items-center">
              <span className="text-orange-400 text-xl ">Name:</span>
              <p className="text-primary text-xl">
                {publicProfile.first_name || publicProfile.last_name
                  ? `${publicProfile.first_name || ""} ${publicProfile.last_name || ""}`
                  : "Name not provided"}
              </p>
            </div>
            <p className="text-primary mt-3">
              {publicProfile.about || "This user hasn't written a bio yet"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {/* Right column — Interests, etc */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-orange-400 mb-2">
              Interests
            </h3>
            {userInterests && userInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userInterests.map((interest) => (
                  <span key={interest.id} className=" text-primary">
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
      </div>
    </>
  );
}
