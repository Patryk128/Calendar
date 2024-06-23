import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1, locale: enUS }),
  getDay,
  locales,
});

const messages = {
  previous: "Previous",
  next: "Next",
  today: "Today",
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
  date: "Date",
  time: "Time",
  event: "Event",
};

const CalendarComponent = ({
  events,
  onSelectSlot,
  onSelectEvent,
  dayPropGetter,
}) => (
  <Calendar
    localizer={localizer}
    events={events}
    startAccessor="start"
    endAccessor="end"
    style={{ height: "100vh" }}
    selectable
    onSelectSlot={onSelectSlot}
    onSelectEvent={onSelectEvent}
    messages={messages}
    dayPropGetter={dayPropGetter}
  />
);

export default CalendarComponent;
