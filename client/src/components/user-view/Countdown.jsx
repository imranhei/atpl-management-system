import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AlarmClockMinus } from "lucide-react";

const WorkCountdown = ({ results }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  const todayRecord = results?.find((item) => item.date === today);

  if (!todayRecord || !todayRecord.first_punch_time) return;

  // Get current time and first punch time as Date objects
  const now = new Date();
  const [punchHour, punchMin, punchSec] = todayRecord.first_punch_time.split(":").map(Number);
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

  return (
    <div className="sm:text-base text-sm flex items-center gap-2 text-rose-500">
      <AlarmClockMinus size={20} color="#f91565" /><span className="font-semibold font-mono">{formatTime(remainingTime)}</span>
    </div>
  );
};

export default WorkCountdown;
