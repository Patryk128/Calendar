import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "./firebase"; // Import Firestore configuration
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import EventModal from "./EventModal";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date, { locale }) => startOfWeek(date, { locale }),
  getDay,
  locales,
});

const messages = {
  allDay: "All Day",
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
  noEventsInRange: "No events in range",
  showMore: (total) => `+${total} more`,
};

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            start:
              data.start && data.start.toDate
                ? data.start.toDate()
                : data.start,
            end: data.end && data.end.toDate ? data.end.toDate() : data.end,
          };
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      setError("Event title is required");
      return;
    }
    try {
      const eventToSave = {
        ...newEvent,
        start: newEvent.start,
        end: newEvent.end,
      };
      const docRef = await addDoc(collection(db, "events"), eventToSave);
      setEvents([...events, { ...eventToSave, id: docRef.id }]);
      setNewEvent({ title: "", start: "", end: "" });
      setModalIsOpen(false);
      setSelectedDay(null); // Reset selectedDay after adding event
      setError("");
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      await deleteDoc(doc(db, "events", event.id));
      setEvents(events.filter((e) => e.id !== event.id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDay(start); // Set selected day in state
    setModalIsOpen(true); // Open modal
    setNewEvent({ title: "", start, end }); // Set new event with start and end date
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  return (
    <div>
      <EventModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        selectedDay={selectedDay}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        handleDeleteEvent={handleDeleteEvent}
        error={error}
        selectedEvent={selectedEvent}
        setSelectedDay={setSelectedDay}
        setSelectedEvent={setSelectedEvent}
        setError={setError}
        locales={locales}
      />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        culture="en-US"
        messages={messages}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default MyCalendar;
