import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  onlineUsers: [],
};

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ token, messageData }, { getState }) => {
    try {
      const state = getState();
      const userId = state.chat.selectedUser?.id;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_MONGO}/api/chat/message`,
        {
          ...messageData,
          senderId: state.auth.user.id,
          receiverId: userId,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      return {
        ...messageData,
        senderId: state.auth.user.id,
        receiverId: userId,
        sent_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
);

export const fetchUserConversations = createAsyncThunk(
  "chat/fetchUserConversations",
  async ({ token, receiverId, senderId }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_MONGO}/api/chat/messages/private`,
        {
          params: {
            user1: senderId,
            user2: receiverId,
          },
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user conversations:", error);
      throw error;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      if (state.selectedUser?.id !== action.payload?.id) {
        state.selectedUser = action.payload;
        state.messages = [];
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addMessage: (state, action) => {
      if (state.selectedUser.id === action.payload.senderId) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.isMessagesLoading = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isMessagesLoading = false;
      })
      .addCase(fetchUserConversations.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.messages = action.payload.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          groupId: msg.group_id,
          message: msg.message,
          image_url: msg.image_url,
          sent_at: msg.sent_at,
        }));
        state.isMessagesLoading = false;
      })
      .addCase(fetchUserConversations.rejected, (state) => {
        state.isMessagesLoading = false;
      });
  },
});

export const { setSelectedUser, setOnlineUsers, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
