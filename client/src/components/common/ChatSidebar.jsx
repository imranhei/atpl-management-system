import { EllipsisVertical, Users } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "/avatar.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSelectedUser } from "@/store/chat/chat-slice";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatSidebar = ({ setChat = () => {} }) => {
  const dispatch = useDispatch();
  const { selectedUser, isUserLoading, onlineUsers } = useSelector((state) => state.chat);
  const { employeeDetails } = useSelector((state) => state.employeeDetails);

  console.log(employeeDetails)
  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="h-full w-full sm:w-14 lg:w-72 bg-secondary border-r border-gray-300 dark:border-gray-600 flex flex-col transition-all duration-200">
      <div className="p-3">
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-6 lg:mx-0 sm:mx-auto " />
            <span className="font-medium sm:hidden lg:block">Contacts</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Notification</DropdownMenuItem>
              <DropdownMenuItem>Create Group</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">
        {employeeDetails?.map((user) => (
          <div key={user.id}>
            <button
              className={`flex items-center px-1 py-1 gap-2 w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${
                selectedUser?.id === user.id ? "ring-gray-300" : ""
              }`}
              onClick={() => {
                if (selectedUser?.id !== user.id) {
                  dispatch(setSelectedUser(user));
                }
                setChat();
              }}
            >
              <div className="relative sm:mx-auto lg:mx-2 mx-4">
                <Avatar>
                  <AvatarImage
                    src={`${import.meta.env.VITE_API_URL}${user.profile_img}`}
                    alt={user?.first_name}
                  />
                  <AvatarFallback>
                    {user?.first_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {onlineUsers.includes(String(user.id)) && (
                <span className="absolute bottom-0.5 right-0.5 size-2 bg-green-500 rounded-full ring-1 ring-zinc-600"></span>
              )}
              </div>
              <div className="sm:hidden lg:block text-left min-w-0">
                <div className="truncate">{user.first_name}</div>
                <div className="text-xs text-rose-500">
                  {onlineUsers.includes(String(user.id)) ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  "Offline"
                )}
                </div>
              </div>
            </button>
            <Separator />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;
