import { useEffect, useState } from "react";
import RollingDigit from "./RollingDigit";
import { AlarmClockMinus } from "lucide-react";

const WorkCountdown = ({ results }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (!results?.length) return;

    const today = new Date().toISOString().split("T")[0];
    const todayRecord = results?.find((item) => item.date === today);

    if (!todayRecord || !todayRecord.first_punch_time) return;

    // Get current time and first punch time as Date objects
    const now = new Date();
    const [punchHour, punchMin, punchSec] = todayRecord.first_punch_time
      .split(":")
      .map(Number);
    const punchTime = new Date();
    punchTime.setHours(punchHour, punchMin, punchSec, 0);

    // Calculate worked seconds so far
    const workedSeconds = Math.floor((now - punchTime) / 1000);
    const requiredSeconds = 9 * 3600;
    const timeLeft = requiredSeconds - workedSeconds;

    if (timeLeft > 0) {
      setRemainingTime(timeLeft);
    }
  }, [results]);

  useEffect(() => {
    if (!remainingTime) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  if (!remainingTime) return null;

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const workedSeconds = 9 * 3600 - remainingTime;
  const percentCompleted = Math.min(
    100,
    Math.max(0, (workedSeconds / (9 * 3600)) * 100)
  );

  return (
    <div className="sm:text-base text-sm flex items-center gap-2 text-white bg-slate-800 dark:bg-slate-800 p-2 px-4 rounded-md shadow-md overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-full h-1">
        <div
          className={`h-full relative overflow-hidden ${
            percentCompleted < 50
              ? "bg-rose-400"
              : percentCompleted < 80
              ? "bg-violet-400"
              : "bg-emerald-400"
          }`}
          style={{ width: `${percentCompleted}%` }}
        >
          <div className="absolute inset-0 w-full h-full">
            <div
              className="absolute left-0 w-4 h-full animate-slide-horizontal bg-gradient-to-r from-transparent to-white/70"
              style={{
                animationDuration:
                  percentCompleted < 33
                    ? "1.5s"
                    : percentCompleted < 66
                    ? "2s"
                    : "2.5s",
              }}
            />
          </div>
        </div>
      </div>

      <AlarmClockMinus className="animate-skew-shake-x text-white" size={20} />
      <span className="text-shadow-lg/30 flex gap-[0.1em] items-center">
        {remainingTime == null || isNaN(remainingTime)
          ? null
          : formatTime(remainingTime)
              .split("")
              .map((char, idx) => <RollingDigit key={idx} digit={char} />)}
      </span>
    </div>
  );
};

export default WorkCountdown;
