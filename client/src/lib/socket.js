import { io } from "socket.io-client";
import { addMessage, setOnlineUsers } from "@/store/chat/chat-slice";

let socket = null;

export const connectSocket = (userId, dispatch) => {
  if (!socket || !socket.connected) {
    socket = io(import.meta.env.VITE_API_URL_MONGO, {
      query: { userId },
        transports: ['websocket'],
    });
    socket.on("connect", () => {
      console.log(`Socket connected with ID: ${socket.id}`);
    });
    
    socket.on("getOnlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));
    });
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};