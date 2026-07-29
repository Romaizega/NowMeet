import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProfiles } from "../features/profile/profileThunk";
import { useNavigate } from "react-router-dom";
import defultAvatar from "../assests/default_avatar.webp";

export default function ViewAllProfiles() {
  const { error, allProfiles, status, pagination } = useSelector(
    (state) => state.profile,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllProfiles({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading people...</span>;

  if (status === "failed") return <p className="text-red-500">{error}</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="relative z-10 flex w-full min-h-screen items-start px-4 sm:px-6 lg:pl-14 lg:pr-6 pt-8 sm:pt-10 lg:pt-20">
        <div className="w-full xl:w-3/4 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                People
              </h1>

              <p className="text-primary text-sm sm:text-base lg:text-xl opacity-50 mt-1">
                Discover and connect with amazing people
              </p>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-[2fr_1.2fr_1fr_auto] items-center gap-6 px-6 mt-10 mb-3 text-primary/60 text-sm font-semibold">
            <span>User</span>
            <span>Location</span>
            <span>Joined</span>
            <span className="text-center">Action</span>
          </div>

          <div className="flex flex-col gap-3 mt-6 lg:mt-0">
            {allProfiles?.map((profile) => (
              <div
                key={profile.id}
                className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr_1fr_auto] items-start lg:items-center gap-5 lg:gap-6 bg-base-200 border border-primary/10 rounded-2xl px-4 py-5 sm:p-6 transition-all duration-300 hover:border-orange-350/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="avatar shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-orange-350 overflow-hidden bg-base-300">
                      <img
                        src={
                          profile.photo
                            ? `/uploads/${profile.photo}`
                            : defultAvatar
                        }
                        alt={profile.username}
                        className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="text-primary text-lg sm:text-xl font-bold truncate">
                      {profile.first_name} {profile.last_name}
                    </h3>

                    <p className="text-primary/50 text-sm sm:text-base truncate">
                      {profile.username}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <span className="lg:hidden text-xs uppercase tracking-wider text-primary/40 font-semibold">
                    Location
                  </span>

                  <p className="text-primary text-sm sm:text-base truncate">
                    {profile.city && profile.country
                      ? `${profile.city}, ${profile.country}`
                      : "Location not set"}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="lg:hidden text-xs uppercase tracking-wider text-primary/40 font-semibold">
                    Joined
                  </span>

                  <p className="text-primary text-sm sm:text-base">
                    {formatDate(profile.created_at)}
                  </p>
                </div>

                <div className="flex flex-col justify-center w-full lg:w-auto mt-1 lg:mt-0">
                  <button
                    className="btn btn-outline border-orange-351 text-orange-350 w-full lg:w-auto min-h-11 px-5 sm:px-7 text-sm sm:text-base hover:bg-orange-400 hover:text-black"
                    type="button"
                    onClick={() => handleViewProfile(profile.id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="join flex flex-wrap justify-center gap-2 mt-5">
            {Array.from({ length: pagination.totalPages }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <input
                  key={pageNumber}
                  type="radio"
                  name="people-pagination"
                  aria-label={pageNumber.toString()}
                  className="join-item btn btn-square"
                  checked={page === pageNumber}
                  onChange={() => setPage(pageNumber)}
                />
              );
            })}
          </div>

          {allProfiles?.length === 0 && (
            <div className="flex items-center justify-center min-h-60 mt-6 bg-base-200 border border-primary/10 rounded-2xl px-4">
              <p className="text-primary/50 text-base sm:text-lg text-center">
                No profiles found
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
