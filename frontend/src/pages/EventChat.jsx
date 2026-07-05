import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import socket from "../utils/socket";
import api from "../services/axios";
import defultAvatar from "../assests/default_avatar.png";
import { getEventById } from "../features/events/eventThunk";
import {
  Calendar,
  Clock4,
  MapPin,
  Users,
  MessageCircleMore,
  ArrowLeft,
} from "lucide-react";
import getStatusColor from "../utils/getStatusColor";

export default function EventChat() {
  const { status, error, currentEvent, participants } = useSelector(
    (state) => state.event,
  );
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [localError, setLocalError] = useState(null);
  const [text, setText] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.connect();
    const loadhistory = async () => {
      const { data } = await api.get(`/event/${id}/messages`);
      setMessages(data.messagesUser);
    };
    loadhistory();
    socket.emit("joinEvent", id);
    return () => {
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const handleSend = () => {
    if (!text.trim()) {
      return setLocalError("There is no any message");
    }
    socket.emit("sendMessage", { eventId: id, text });
    setText("");
  };

  useEffect(() => {
    dispatch(getEventById(id));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (!currentEvent) return <span className="loading loading-spinner"></span>;

  return (
    <>
      <div className="flex gap-6">
        <button
          className="btn btn-ghost text-xl"
          onClick={() => navigate("/explore")}
        >
          <ArrowLeft />
          Back to Events
        </button>
      </div>
      <div className="grid grid-cols-5 gap-6 min-h-screen px-10 pt-20">
        <div className="col-span-1 bg-base-200 rounded-xl p-6 flex flex-col gap-4">
          <span className={getStatusColor(currentEvent.status)}>
            {currentEvent.status}
          </span>
          <h2 className="text-2xl text-primary font-bold">
            {currentEvent.title}
          </h2>
          <span className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            {formatDate(currentEvent.event_start)}
          </span>
          <span className="flex items-center gap-2 text-primary">
            <Clock4 className="w-5 h-5" />
            {currentEvent.duration} min
          </span>
          <span className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            {currentEvent.place_name}
          </span>
          <span className="flex items-center gap-2 text-primary">
            <Users className="w-5 h-5" />
            {participants?.length}/{currentEvent.max_participants} going
          </span>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate(`/event/${id}`)}
          >
            Details
          </button>
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-primary text-left">
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
              </div>
            )}
          </div>
        </div>

        {/* right */}
        <div
          className="col-span-2 flex flex-col"
          style={{ height: "calc(100vh - 120px)" }}
        >
          <div className="mb-4 border-b border-orange-400/10 pb-4">
            <h1 className="text-4xl font-bold text-primary">Event Chat</h1>
            <p className="text-primary opacity-50">
              Chat with other participants
            </p>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat mb-3 ${message.user_id === user.id ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-14 rounded-full">
                    <img
                      src={
                        message.photo
                          ? `/uploads/${message.photo}`
                          : defultAvatar
                      }
                      alt={message.username}
                      title={message.username}
                    />
                  </div>
                </div>
                <div className="chat-header">{message.username}</div>
                <div
                  className={`chat-bubble ${
                    message.user_id === user.id
                      ? "bg-orange-400 text-black"
                      : "bg-base-200 text-white"
                  }`}
                >
                  <p>{message.text}</p>

                  <time
                    className={`block mt-1 text-xs ${
                      message.user_id === user.id
                        ? "text-black/70"
                        : "text-white/50"
                    }`}
                  >
                    {formatDate(message.created_at)}
                  </time>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-orange-400/10 py-4">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="input input-bordered flex-1 text-primary"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn btn-outline border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
