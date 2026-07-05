import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import heroPrivateImg from "../assests/privateMessage.png";
import socket from "../utils/socket";
import api from "../services/axios";
import defultAvatar from "../assests/default_avatar.png";
import {ArrowLeft, SendHorizontal } from "lucide-react"

export default function PrivaeChat() {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState(null)
  const [text, setText] = useState("");
  const { id } = useParams();
  const bottomRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    socket.connect();
    const loadHistory = async () => {
      const { data } = await api.get(`/profiles/${id}/private-chat`);
      setMessages(data.messagesUser);
    };
    loadHistory();
    socket.on("connect", ()=>{
      socket.emit("joinPrivate", {recipientId: id});
    })
    return () => {
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    socket.on("private_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket.off("private_message");
    };
  }, []);

  useEffect(() =>  {
    const getProfile = async () =>{
      try {
      const {data} = await api.get(`/profiles/${id}`)
      setRecipient(data.profile)
      } catch (error) {
        console.error("Failed to get recipient", error)
      }
    }
    if(id) {
      getProfile()
    }
  }, [id])

  const handleSend = () => {
    if (!text.trim()) {
      return;
    }
    socket.emit("privateMessage", { recipientId: id, text });
    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return <span className="loading loading-spinner"></span>;

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
      <div
        className="relative rounded-xl overflow-hidden h-[350px] mb-10"
        style={{
          backgroundImage: `url(${heroPrivateImg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 flex flex-col justify-between h-full px-10 pb-6 pt-10">
          <div>
            <button
            className="btn btn-ghost text-xl"
            onClick={() => navigate(`/profile/${id}`)}
            >
            <ArrowLeft />
              Back to Profile</button>
          </div>
          <div className="max-w-2xl mt-2">
            <h1 className="text font-bold text-orange-400">PRIVATE MESSAGES</h1>
            <h1 className="text text-4xl font-bold text-primary mt-2">
              Your conversations,
              <p className="text text-orange"> your space</p>
            </h1>
            <div className="text-xl text-primary opacity-50 mb-16">
              <p>Private, secure and just between </p>
              <p>the two of you</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-350px)] px-10">
        <div className="text text-primary">
          <div className="flex gap-2 items-center">
          <h1 className="text  text-primary font-bold text-2xl">Chat with: </h1>
          <p  className="text text-2xl  text-orange-400 font-bold">{recipient?.username}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat mb-3 ${message.sender_user_id === user.id ? "chat-end" : "chat-start"}`}
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
                  message.sender_user_id === user.id
                    ? "bg-orange-400 text-black"
                    : "bg-base-200 text-white"
                }`}
              >
                <p>{message.text}</p>

                <time
                  className={`block mt-1 text-xs ${
                    message.sender_user_id === user.id
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
        <div className="flex gap-2 border-t border-orange-400/10 py-4 ">
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
            <SendHorizontal className="w-8 h-7" /> 
          </button>
        </div>
      </div>
    </>
  );
}
