import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { getUpcomingMovies } from "../../api/tmdb";

export default function ReleaseCalendar({ country }) {
  const [events, setEvents] = useState([]);
  const [calendarOptions, setCalendarOptions] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const result = await getUpcomingMovies(country);
      const mapped = result.results.map((m) => ({
        id: m.id.toString(),
        title: m.title,
        start: m.release_date,
        backgroundColor: "rgb(99 102 241)",
        textColor: "white",
      }));
      setEvents(mapped);
    }
    load();
  }, [country]);

  useEffect(() => {
    function updateLayout() {
      if (window.innerWidth < 640) {
        // mobile (sm)
        setCalendarOptions({
          headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "",
          },
          aspectRatio: 0.8,
        });
      } else if (window.innerWidth < 1024) {
        // tablet (md)
        setCalendarOptions({
          headerToolbar: {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          },
          aspectRatio: 1.1,
        });
      } else {
        // desktop (lg)
        setCalendarOptions({
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          },
          aspectRatio: 1.5,
        });
      }
    }

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return (
    <div className="bg-black text-white rounded-xl shadow p-4">
      <div className="w-full overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dayHeaderFormat={{ weekday: "short" }}
          dayMaxEventRows={() => true}
          dayMaxEvents={3}
          dayHeaderClassNames={() => "bg-indigo-500 text-white"}
          eventDidMount={(info) => {
            info.el.style.border = "none";
            if (info.el.closest(".fc-popover")) {
              const popover = info.el.closest(".fc-popover");
              const header = popover.querySelector(".fc-popover-header");
              if (header) {
                header.style.backgroundColor = "black";
                header.style.color = "white";
              }
              popover.querySelectorAll(".fc-event").forEach((e) => {
                e.style.border = "none";
              });
            }
          }}
          eventClick={(info) => navigate(`/movie/${info.event.id}`)}
          events={events}
          height="auto"
          {...calendarOptions}
        />
      </div>
    </div>
  );
}
