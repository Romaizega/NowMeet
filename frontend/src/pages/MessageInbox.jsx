import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      <div className="relative z-10 w-full min-h-screen px-14 pt-20">
        <div className="w-full text-left">
          <h1 className="text lg:text-5xl font-bold leading-tight text-primary">
            Messages
          </h1>

          <p className="text-primary text-xl mb-6 opacity-50">
            Your conversations
          </p>

          <div className="grid grid-cols-3 gap-6">
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
                    className="flex items-center gap-4 p-4 border-b border-orange-400/10 cursor-pointer hover:bg-black/30"
                  >
                    <img
                      src={
                        message.photo
                          ? `${import.meta.env.VITE_SERVER_URL}/uploads/${message.photo}`
                          : "/default-avatar.png"
                      }
                      alt={message.username}
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-primary font-bold text-lg">
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

            <div className="col-span-2 bg-base-200 rounded-xl min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-24 h-24 text-primary mx-auto mb-6" />

                <h2 className="text-4xl font-bold text-primary">
                  Your inbox is empty
                </h2>

                <p className="text-primary opacity-50 text-xl mt-3">
                  When you get new messages, they will appear here.
                </p>

                <button
                  className="btn btn-primary mt-6"
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
