import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar1Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CAL_HEIGHT = 370;

const CalendarDropdown = ({
  selectedDates,
  setSelectedDates,
  setFormData,
  placeholder = "Select date(s)",
}) => {
  const [openCal, setOpenCal] = useState(false);
  const [side, setSide] = useState("bottom");
  const triggerCalRef = useRef(null);
  const dropdownRef = useRef(null);

  // ⬇️ Detect outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        openCal &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerCalRef.current?.contains(e.target)
      ) {
        setOpenCal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCal]);

  // ⬇️ Flip dropdown above if no space
  useEffect(() => {
    if (openCal && triggerCalRef.current) {
      const rect = triggerCalRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setSide(spaceBelow < CAL_HEIGHT ? "top" : "bottom");
    }
  }, [openCal]);

  const prettySummary =
    selectedDates.length > 0
      ? selectedDates.length > 2
        ? `${selectedDates
            .slice(0, 2)
            .map((d) => format(d, "dd/MM/yyyy"))
            .join(", ")} +${selectedDates.length - 2} more`
        : selectedDates.map((d) => format(d, "dd/MM/yyyy")).join(", ")
      : placeholder;

  return (
    <div className="relative w-full">
      <Button
        ref={triggerCalRef}
        type="button"
        onClick={() => setOpenCal((o) => !o)}
        className={cn(
          "justify-start font-normal !bg-sidebar shadow-none dark:text-white border hover:bg-gray-100 w-full",
          !selectedDates.length && "text-muted-foreground dark:text-muted-foreground"
        )}
      >
        <Calendar1Icon className="mr-2 inline-block" />
        {prettySummary}
      </Button>

      {openCal && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute left-0 w-auto p-0 max-h-[min(370px,calc(100vh-96px))] overflow-auto z-[9999] bg-background border rounded-md shadow-md",
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          )}
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div data-calendar-root>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => {
                const safe = dates ?? [];
                setSelectedDates(safe);
                setFormData((prev) => ({
                  ...prev,
                  date: safe.map((d) => format(d, "yyyy-MM-dd")),
                }));
              }}
              footer={
                <div className="flex items-center justify-between gap-2 border-t sticky bottom-0 bg-background">
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-1"
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      setSelectedDates((prev) => {
                        const exists = prev.some(
                          (d) => d.toDateString() === today.toDateString()
                        );
                        const next = exists ? prev : [...prev, today];
                        setFormData((f) => ({
                          ...f,
                          date: next.map((d) => format(d, "yyyy-MM-dd")), // ✅ array
                        }));
                        return next;
                      });
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    className="p-1"
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenCal(false)}
                  >
                    OK
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDropdown;
