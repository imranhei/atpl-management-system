import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LeaveCancelled() {
  const [events, setEvents] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  // --------------------------------------------
  // FETCH UPCOMING LEAVES
  // --------------------------------------------
  async function loadUpcoming() {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const res = await fetch(
      "https://djangoattendance.atpldhaka.com/api/leave/upcoming-leaves/",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    const upcoming = data.upcoming || [];

    const mapped = [];

    upcoming.forEach((leave) => {
      leave.dates.forEach((d) => {
        // -----------------------------
        // COLOR MAPPING
        // -----------------------------
        let eventColor = "#3b82f6"; // FULL DAY (BLUE)
        let textColor = "white";

        if (leave.leave_type === "1st_half" || leave.leave_type === "2nd_half") {
          eventColor = "#8b5cf6"; // HALF DAY (PURPLE)
        }

        mapped.push({
          id: leave.id,
          title: `${leave.first_name} ${leave.last_name}`,
          date: d,
          backgroundColor: eventColor,
          borderColor: eventColor,
          textColor: textColor,
          extendedProps: {
            leave,
          },
        });
      });
    });

    setEvents(mapped);
  }

  useEffect(() => {
    loadUpcoming();
  }, []);

  // --------------------------------------------
  // WHEN CLICK ON EVENT
  // --------------------------------------------
  function handleEventClick(info) {
    const leave = info.event.extendedProps.leave;
    setSelectedLeave(leave);
    setSelectedDates([...leave.dates]);
  }

  // Toggle date selection
  function toggleDate(d) {
    if (selectedDates.includes(d)) {
      setSelectedDates(selectedDates.filter((x) => x !== d));
    } else {
      setSelectedDates([...selectedDates, d]);
    }
  }

  // --------------------------------------------
  // CANCEL LEAVE
  // --------------------------------------------
  async function handleCancel() {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const res = await fetch(
      `https://djangoattendance.atpldhaka.com/api/leave/admin-cancel-future/${selectedLeave.id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dates: selectedDates }),
      }
    );

    const result = await res.json();

    if (res.ok) {
      toast.success("Leave successfully cancelled!", {
        description: selectedDates.join(", "),
      });

      setSelectedLeave(null);
      loadUpcoming();
    } else {
      toast.error(result.error || "Cancellation failed");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Leave Calendar</h2>

      {/* -------------------------------------------- */}
      {/* LEGEND (FULL DAY / HALF DAY)                 */}
      {/* -------------------------------------------- */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-blue-500"></span>
          <span className="text-sm">Full Day</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-purple-500"></span>
          <span className="text-sm">Half Day</span>
        </div>
      </div>

      {/* CALENDAR */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventClassNames="fc-clickable"
        height="80vh"
      />

      {/* POPUP WINDOW */}
      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Leave</DialogTitle>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-3">
              <p>
                <strong>Employee:</strong>{" "}
                {selectedLeave.first_name} {selectedLeave.last_name}
              </p>

              <p>
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>

              <p className="font-semibold">Select dates to cancel:</p>

              <div className="space-y-2">
                {selectedLeave.dates.map((d) => (
                  <label
                    key={d}
                    className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDates.includes(d)}
                      onChange={() => toggleDate(d)}
                      className="
                        h-4 w-4 rounded
                        border-gray-400
                        text-blue-500
                        focus:ring-blue-500
                        cursor-pointer
                      "
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedLeave(null)}>
              Close
            </Button>

            <Button
              disabled={selectedDates.length === 0}
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancel Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* POINTER CURSOR */}
      <style>
        {`
          .fc-clickable {
            cursor: pointer !important;
          }
        `}
      </style>
    </div>
  );
}