import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { useState } from "react";

// import existing ShadCN dialog (already in your project)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FullCalendarView({ data, onMonthChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const events = [];

  // ⭐ SAME LOGIC — NOT REMOVED
  data?.days?.forEach((day) => {
    day.leaves.forEach((lv) => {
      events.push({
        title: `${lv.first_name} ${lv.last_name}`,
        date: day.date,
        allDay: true,
        backgroundColor:
          lv.leave_type === "full_day"
            ? "rgb(244, 63, 94)"
            : "rgb(124, 58, 237)", // brown / blue
        borderColor: "transparent",
        extendedProps: { ...lv },
      });
    });
  });

  return (
    <div className="p-4 bg-background rounded border shadow mt-4">
      <h2 className="text-lg font-semibold mb-3">Leave Calendar</h2>

      <div className="calendar-legend">
        <span className="legend-item">
          <span className="color-box full-day"></span> Full Day Leave
        </span>
        <span className="legend-item">
          <span className="color-box half-day"></span> Half Day Leave
        </span>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        events={events}
        datesSet={(info) => {
          const month = info.startStr.slice(0, 7); // YYYY-MM
          onMonthChange(month);
        }}
        // ⭐ Change cursor
        eventMouseEnter={(e) => {
          e.el.style.cursor = "pointer";
        }}
        // ⭐ Replace alert() with modal
        eventClick={(info) => {
          setSelected(info.event.extendedProps);
          setOpen(true);
        }}
      />

      {/* ⭐ BEAUTIFUL POPUP — no new file */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-background border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Leave Details
            </DialogTitle>
            <DialogDescription>Employee leave information</DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="mt-4 space-y-2">
              <p>
                <strong>Name:</strong> {selected.first_name}{" "}
                {selected.last_name}
              </p>
              <p>
                <strong>Type:</strong> {selected.leave_type}
              </p>
              <p>
                <strong>Reason:</strong> {selected.reason}
              </p>
              <p>
                <strong>Informed:</strong>{" "}
                {selected.informed_status === "informed" ? "Yes" : "No"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
