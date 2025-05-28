import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import ChatSidebar from "@/components/common/ChatSidebar";
import NoChatSelected from "@/components/common/NoChatSelected";
import ChatContainer from "@/components/common/ChatContainer";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeDetails } from "@/store/admin/employee-details-slice";
import { connectSocket, disconnectSocket } from "@/lib/socket";

const Chat = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(getEmployeeDetails({ token }));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      connectSocket(user.id, dispatch);
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <div className="h-fit w-full">
      <div className="flex w-full items-center justify-center">
        <div className="bg-gray-100 rounded-lg shadow-lg w-full max-w-5xl sm:h-[calc(100vh-6rem)] h-[calc(100vh-8rem)]">
          <Card className="sm:flex h-full rounded-lg overflow-hidden relative hidden">
            <ChatSidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </Card>
          <Card className="sm:hidden h-full rounded-lg overflow-hidden relative flex">
            {chat ? (
              <ChatContainer setChat={() => setChat((prev) => !prev)} />
            ) : (
              <ChatSidebar setChat={() => setChat((prev) => !prev)} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
