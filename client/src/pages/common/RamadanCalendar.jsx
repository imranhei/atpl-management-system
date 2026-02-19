import { ramadanData2026 as ramadanData } from "@/components/config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Moon,
  Star,
  Sun,
  Sunset,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Parses "5:12 AM" into a Date on the same day as baseDate
function parseTimeOnDate(timeStr, baseDate = new Date()) {
  const [time, period] = timeStr.trim().split(" ");
  const [hRaw, m] = time.split(":").map(Number);

  let h = hRaw;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function diffParts(target, now = new Date()) {
  let diff = target.getTime() - now.getTime();
  if (diff < 0) diff = 0;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getTodayRow(data, now = new Date()) {
  // data date format: "Feb 19" "Mar 01"
  // We'll match by month/day in user's locale date.
  const monthShort = now.toLocaleString("en-US", { month: "short" });
  const dayNum = String(now.getDate()).padStart(2, "0");
  const key = `${monthShort} ${dayNum}`;
  return data.find((r) => r.date === key) || null;
}

export default function RamadanCalendar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [nextEvent, setNextEvent] = useState(null); // "Seheri" | "Iftar" | null
  const [fastingProgress, setFastingProgress] = useState(0);
  const [isFasting, setIsFasting] = useState(false);

  const todayRow = useMemo(
    () => getTodayRow(ramadanData, currentTime),
    [currentTime],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // If today isn't in ramadanData, fallback to first row.
      const row = getTodayRow(ramadanData, now) || ramadanData[0];

      const seheriToday = parseTimeOnDate(row.seheri, now);
      const iftarToday = parseTimeOnDate(row.iftar, now);

      // ✅ fasting progress (between seheri end -> iftar)
      const seheriMs = seheriToday.getTime();
      const iftarMs = iftarToday.getTime();
      const nowMs = now.getTime();

      if (nowMs >= seheriMs && nowMs <= iftarMs) {
        setIsFasting(true);
        const total = iftarMs - seheriMs;
        const elapsed = nowMs - seheriMs;
        const progress = (elapsed / total) * 100;
        setFastingProgress(Math.min(Math.max(progress, 0), 100));
      } else {
        setIsFasting(false);
        setFastingProgress(0);
      }

      // ✅ next event + countdown (your old logic)
      if (now < seheriToday) {
        setNextEvent("Seheri");
        setCountdown(diffParts(seheriToday, now));
      } else if (now < iftarToday) {
        setNextEvent("Iftar");
        setCountdown(diffParts(iftarToday, now));
      } else {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextRow = getTodayRow(ramadanData, tomorrow) || row;
        const seheriTomorrow = parseTimeOnDate(nextRow.seheri, tomorrow);

        setNextEvent("Seheri");
        setCountdown(diffParts(seheriTomorrow, now));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 dark:from-emerald-950 dark:via-amber-950/30 dark:to-teal-950 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <main className="flex-1 container mx-auto sm:px-4 px-2 sm:py-8 py-4 md:py-12 relative z-10">
        {/* Header */}
        <div className="text-center sm:mb-8 mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="sm:size-10 size-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="sm:text-4xl text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-amber-600 to-emerald-700 dark:from-emerald-400 dark:via-amber-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Ramadan 2026
            </h1>
            <Star className="sm:size-10 size-6 text-amber-500 fill-amber-500" />
          </div>
          <div className="sm:mt-0 -mt-2 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300">
            <MapPin className="size-5" />
            <p className="text-md sm:text-xl font-medium">Dhaka, Bangladesh</p>
          </div>
          {/* <Badge
            variant="secondary"
            className="mt-3 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-sm md:text-base"
          >
            * Tentative Schedule
          </Badge> */}
        </div>

        {/* Clock Section */}
        <Card className="mb-8  bg-white/80 dark:bg-emerald-950/80 backdrop-blur-sm border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
          <CardHeader className="sm:pb-4 pb-2">
            <CardTitle className="text-center text-lg flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Clock className="size-5" />
              Current Time
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-bold text-emerald-700 dark:text-emerald-300 sm:mb-4 mb-2 font-mono">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </div>
              <p className="text-lg text-emerald-600 dark:text-emerald-400 sm:mb-6 mb-4">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* Countdown */}
              <div className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-900/50 dark:to-amber-900/50 rounded-xl sm:p-6 p-2 sm:m-6 m-2 border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {nextEvent === "Seheri" ? (
                    <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Sunset className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  )}
                  <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200">
                    Time Until {nextEvent}
                  </h3>
                </div>
                <div className="flex justify-center gap-4 md:gap-8">
                  <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-emerald-950 rounded-lg p-3 md:p-4 shadow-md">
                      {String(countdown.hours).padStart(2, "0")}
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                      Hours
                    </p>
                  </div>
                  <div className="text-4xl md:text-6xl font-bold text-emerald-400 dark:text-emerald-600 sm:mt-0 mt-1">
                    :
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-emerald-950 rounded-lg p-3 md:p-4 shadow-md">
                      {String(countdown.minutes).padStart(2, "0")}
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                      Minutes
                    </p>
                  </div>
                  <div className="text-4xl md:text-6xl font-bold text-emerald-400 dark:text-emerald-600 sm:mt-0 mt-1">
                    :
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-emerald-950 rounded-lg p-3 md:p-4 shadow-md">
                      {String(countdown.seconds).padStart(2, "0")}
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                      Seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Today's Ramadan info */}
          {todayRow && (
            <div className="sm:m-7 m-3 sm:-mt-4 -mt-1 grid grid-cols-3 md:grid-cols-3 gap-2">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white/70 dark:bg-emerald-950/60 p-4 text-center">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Ramadan Day
                </p>
                <p className="sm:text-2xl text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {todayRow.ramadan}
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-white/70 dark:bg-emerald-950/60 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Seheri End
                  </p>
                </div>
                <p className="sm:text-2xl text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {todayRow.seheri}
                </p>
              </div>

              <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-white/70 dark:bg-emerald-950/60 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sunset className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Iftar Time
                  </p>
                </div>
                <p className="sm:text-2xl text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {todayRow.iftar}
                </p>
              </div>
            </div>
          )}

          {!todayRow && (
            <div className="mt-4 text-center text-sm text-amber-700 dark:text-amber-300">
              Today is not found in the dataset — showing nearest schedule.
            </div>
          )}
        </Card>

        {/* Calendar Section */}
        <Card className="bg-white/80 dark:bg-emerald-950/80 backdrop-blur-sm border border-emerald-200/70 dark:border-emerald-800/70 shadow-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6" />
                <span>Ramadan Calendar</span>
              </div>

              {/* optional small legend */}
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 border border-emerald-200 dark:border-emerald-800 bg-white/60 dark:bg-emerald-950/40">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Regular
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 border border-amber-200 dark:border-amber-800 bg-white/60 dark:bg-emerald-950/40">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Today
                </span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 sm:m-6 mt-0 m-3">
            <ScrollArea className="h-[650px] md:h-[750px] rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
              {/* Sticky header */}
              <div className="sticky top-0 z-10 backdrop-blur bg-white/80 dark:bg-emerald-950/80 border-b border-emerald-200/60 dark:border-emerald-800/60">
                <div className="px-4 py-3 grid grid-cols-12 gap-3 text-xs md:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <div className="col-span-2">Day</div>
                  <div className="col-span-4 md:col-span-3">Date</div>
                  <div className="hidden md:block md:col-span-2">Weekday</div>
                  <div className="col-span-6 md:col-span-5 flex justify-end gap-6">
                    <span className="inline-flex items-center gap-1">
                      <Sun className="w-4 h-4" /> Seheri
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Sunset className="w-4 h-4" /> Iftar
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2 md:p-4 sm:space-y-2 space-y-1">
                {ramadanData.map((day) => {
                  const isToday = todayRow?.ramadan === day.ramadan;

                  return (
                    <div
                      key={day.ramadan}
                      className={[
                        "relative rounded-lg border transition-all duration-200",
                        "bg-white/70 dark:bg-emerald-950/50",
                        "border-emerald-200/60 dark:border-emerald-800/60",
                        "hover:shadow-lg hover:-translate-y-[1px]",
                        isToday
                          ? "ring-1 ring-amber-400/60 dark:ring-amber-500/40 border-amber-200/70 dark:border-amber-800/60"
                          : "",
                      ].join(" ")}
                    >
                      {/* left accent bar */}
                      <div
                        className={[
                          "absolute left-0 top-0 h-full w-1.5 rounded-l-2xl",
                          isToday ? "bg-amber-500" : "bg-emerald-500",
                        ].join(" ")}
                      />

                      <div className="px-3 py-2 grid grid-cols-12 gap-3 items-center">
                        {/* Day */}
                        <div className="col-span-2 flex items-center gap-2">
                          <Badge
                            className={[
                              "text-xs font-bold",
                              isToday
                                ? "bg-amber-500 hover:bg-amber-600 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white",
                            ].join(" ")}
                          >
                            {day.ramadan}
                          </Badge>

                          {isToday && (
                            <span className="hidden md:inline-flex text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <div className="col-span-4 md:col-span-3">
                          <div className="text-sm md:text-base font-semibold text-emerald-900 dark:text-emerald-100">
                            {day.date}
                          </div>
                          {/* show weekday under date on mobile */}
                          <div className="md:hidden text-xs text-emerald-600 dark:text-emerald-400">
                            {day.day}
                          </div>
                        </div>

                        {/* Weekday (desktop) */}
                        <div className="hidden md:block md:col-span-2 text-sm text-emerald-700 dark:text-emerald-300">
                          {day.day}
                        </div>

                        {/* Times */}
                        <div className="col-span-6 md:col-span-5 flex justify-end gap-2 md:gap-4">
                          <span
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold
                                  border border-amber-200/70 dark:border-amber-800/60
                                  bg-amber-50/80 dark:bg-amber-950/30
                                  text-amber-800 dark:text-amber-200"
                          >
                            <Sun className="w-4 h-4" />
                            {day.seheri}
                          </span>

                          <span
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold
                                  border border-orange-200/70 dark:border-orange-800/60
                                  bg-orange-50/80 dark:bg-orange-950/30
                                  text-orange-800 dark:text-orange-200"
                          >
                            <Sunset className="w-4 h-4" />
                            {day.iftar}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
