import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInbox } from "../features/message/messageThunk";
import { MessageCircle, Search } from "lucide-react";

export default function MessageInbox() {
  const { status, error, inbox } = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getInbox());
  }, [dispatch]);

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-14 pt-10 lg:pt-20">
        <div className="w-full text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-primary">
            Messages
          </h1>

          <p className="text-primary text-base lg:text-xl mb-6 opacity-50">
            Your conversations
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 bg-base-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-orange-400/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-50" />

                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="input input-bordered input-primary w-full text-primary pl-10"
                  />
                </div>
              </div>

              {inbox?.length > 0 ? (
                inbox.map((message) => (
                  <div
                    key={message.id}
                    onClick={() =>
                      navigate(`/profile/${message.other_user_id}/private-chat`)
                    }
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-orange-400/10 cursor-pointer hover:bg-black/30"
                  >
                    <img
                      src={
                        message.photo
                          ? `/uploads/${message.photo}`
                          : "/default-avatar.png"
                      }
                      alt={message.username}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-primary font-bold text-base sm:text-lg">
                        {message.username}
                      </h3>

                      <p className="text-primary opacity-50 line-clamp-1">
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-primary opacity-50">
                  No messages yet
                </div>
              )}
            </div>

            <div className="col-span-1 lg:col-span-2 bg-base-200 rounded-xl min-h-[360px] lg:min-h-[600px] flex items-center justify-center p-6">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 lg:w-24 lg:h-24 text-primary mx-auto mb-4 lg:mb-6" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  Your inbox is empty
                </h2>

                <p className="text-primary opacity-50 text-base lg:text-xl mt-3">
                  When you get new messages, they will appear here.
                </p>

                <button
                  className="btn btn-primary mt-6 w-full sm:w-auto"
                  onClick={() => navigate("/explore")}
                >
                  Explore Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
