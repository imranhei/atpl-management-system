import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

const TextChangeAnimation = ({ punch }) => {
  const status = punch?.status || "";
  const segments = status.includes("+")
    ? status.split("+").map((s) => s.trim())
    : status
    ? [status]
    : [];

  if (segments.length === 0) {
    // 🟦 No status — show gray placeholder
    return (
      <div className="h-7 flex items-center justify-center sm:rounded-md rounded-sm bg-green-500">
        <CircleCheckBig size={18} color="#ffffff" strokeWidth={2.25} />
      </div>
    );
  }

  if (segments.length === 1) {
    // ✅ Single status — no animation
    const bg = segments[0].toLowerCase().includes("late")
      ? "bg-violet-600"
      : "bg-rose-500";

    return (
      <div
        className={cn(
          "h-7 flex items-center justify-center text-white sm:rounded-md rounded-sm",
          bg
        )}
      >
        {segments[0]}
      </div>
    );
  }

  return (
    <div className="relative h-7 overflow-hidden sm:rounded-md rounded-sm">
      <div className="absolute inset-0 flex items-center justify-center sm:rounded-md rounded-sm bg-violet-600 text-white animate-slide-in">
        {segments[0]}
      </div>
      <div className="absolute inset-0 flex items-center justify-center sm:rounded-md rounded-sm bg-rose-500 text-white animate-slide-out">
        {segments[1]}
      </div>
    </div>
  );
};

export default TextChangeAnimation;
