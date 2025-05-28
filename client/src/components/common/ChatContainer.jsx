import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { fetchUserConversations } from "@/store/chat/chat-slice";

const ChatContainer = ({ setChat }) => {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const { selectedUser, messages, isMessagesLoading } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (selectedUser && token) {
      dispatch(
        fetchUserConversations({
          token,
          receiverId: selectedUser.id,
          senderId: user.id,
        })
      );
    }
  }, [dispatch, selectedUser]);

  useEffect(() => {
    if (messageEndRef.current && messages?.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-muted">
      <ChatHeader setChat={setChat} />

      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`${
                message.senderId === user.id ? "self-end " : "self-start"
              }`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div
                className={`flex ${
                  message.senderId === user.id ? "flex-row-reverse" : ""
                } gap-2`}
              >
                <Avatar className="w-6 h-6 rounded-full ring-2 mt-0.5">
                  <AvatarImage
                    src={`${import.meta.env.VITE_API_URL}${
                      message.senderId === user.id
                        ? user.profile_img
                        : selectedUser.profile_img
                    }`}
                    alt="Profile Picture"
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div
                  className={`${
                    message.senderId === user.id
                      ? "bg-blue-100"
                      : "bg-gray-200"
                  } relative p-2 rounded-sm min-w-20 max-w-[75%] pb-5`}
                >
                  {message?.image_url && (
                    <img src={message.image_url} alt="" className="pb-2" />
                  )}
                  <p className="text-sm leading-4">{message.message}</p>
                  <span
                    className={`absolute bottom-0.5 text-[10px] text-gray-500 ${
                      message.senderId === user.id ? "right-2" : "left-2"
                    }`}
                  >
                    {new Date(message.sent_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
