import { useState, useRef, useEffect } from "react";
import { SendHorizonal, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatWindow = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [targetUserData, setTargetUserData] = useState({});

  const messagesEndRef = useRef(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const navigate = useNavigate();

  const getTargetUserData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/request/profile/${targetUserId}`,
        {
          withCredentials: true,
        }
      );
      setTargetUserData(res?.data);
    } catch (err) {
      console.error("Error fetching target user data:", err);
    }
  };

  const getPreviousChat = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      const prevMessages = res?.data?.data?.messages;
      const formattedMessages = prevMessages.map((m) => ({
        text: m.text,
        sender: m.senderId === userId ? "user" : "targetUser",
        timestamp: new Date(m.updatedAt).toISOString(), // Ensure valid date format
      }));
      setMessages(formattedMessages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTargetUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ sendUserId, newMsg, time }) => {
      if (sendUserId == userId) return;
      setMessages((messages) => [
        ...messages,
        {
          text: newMsg,
          sender: "targetUser",
          timestamp: new Date(time).toISOString(),
        },
      ]);
    });

    getPreviousChat();

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((messages) => [
      ...messages,
      { text: input, sender: "user", timestamp: new Date().toISOString() },
    ]);
    socketRef.current?.emit("sendMessage", {
      userId,
      targetUserId,
      newMsg: input,
    });
    setInput("");
  };

  return (
    <div className="mt-[70px] mb-[60px] flex justify-center items-center px-4">
      <div className="w-full max-w-2xl h-[80vh] bg-gradient-to-br from-[#1a1a1d] to-[#0e0e10] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        {targetUserData.firstName && (
          <div className="relative p-4 text-center font-semibold text-white border-b border-gray-700">
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer 
             transition-all duration-300 ease-in-out 
             hover:bg-red-500 hover:text-white hover:scale-100 
             rounded-full p-2"
              onClick={() => navigate("/connections")}
            >
              <ArrowLeft className="text-red-500 hover:text-white" size={24} />
            </div>
            {targetUserData.firstName}
            {targetUserData.lastName ? ` ${targetUserData.lastName}` : ""}
          </div>
        )}

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end mb-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "targetUser" && (
                <img
                  src={targetUserData?.profilePic}
                  alt="targetUser"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}

              <div className="flex flex-col max-w-xs">
                <div
                  className={`relative px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-fuchsia-600 text-white rounded-br-none self-end"
                      : "bg-gray-600 text-white rounded-bl-none self-start"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`absolute bottom-0 ${
                      msg.sender === "user"
                        ? "right-[-6px] w-3 h-3 bg-fuchsia-600 rotate-45 rounded-sm"
                        : "left-[-6px] w-3 h-3 bg-gray-600 rotate-45 rounded-sm"
                    }`}
                  ></div>
                </div>

                {/* Timestamp BELOW the bubble */}
                <span
                  className={`text-[10px] text-gray-400 mt-1 ${
                    msg.sender === "user" ? "text-right pr-2" : "text-left pl-2"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {msg.sender === "user" && (
                <img
                  src={user?.profilePic}
                  alt="me"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 bg-[#0e0e10] flex items-center gap-2">
          <input
            type="text"
            placeholder="Type here..."
            className="input input-sm w-full bg-[#1f1f22] text-white border-none focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="btn btn-circle btn-sm bg-purple-600 hover:bg-purple-700 border-none text-white"
            onClick={handleSend}
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
