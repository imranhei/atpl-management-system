import React from "react";
import { ArrowLeft, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/store/chat/chat-slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ChatHeader = ({ setChat }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((state) => state.chat);

  return (
    <div className="p-2.5 border-b border-gray-300 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              dispatch(setSelectedUser(null));
              setChat();
            }}
            className="sm:hidden block px-2"
            variant="ghost"
          >
            <ArrowLeft />
          </Button>
          <Avatar className="size-10 rounded-full overflow-hidden">
            <AvatarImage
              src={`${import.meta.env.VITE_API_URL}${
                selectedUser?.profile_img
              }`}
              alt={selectedUser?.first_name}
            />
            <AvatarFallback className="bg-gray-300 text-gray-700">
              {selectedUser?.first_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="fent-medium">{selectedUser?.first_name}</h3>
            <p className="text-xs text-rose-500">
              {onlineUsers.includes(String(selectedUser.id)) ? (
                <span className="text-green-500">Online</span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <Button variant="ghost" className="hidden sm:block" onClick={() => dispatch(setSelectedUser(null))}>
          <X />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
