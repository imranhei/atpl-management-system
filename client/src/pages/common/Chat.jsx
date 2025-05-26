import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const Chat = () => {
  const [dev, setDev] = useState(true);
  return (
    <div className="flex items-center justify-center h-full">
      {dev ? (
        <div className="flex items-center">
          <LoaderCircle size={32} className="animate-spin pr-4" /> Under
          Developing
        </div>
      ) : (
        <Card className="w-full h-full"></Card>
      )}
    </div>
  );
};

export default Chat;
