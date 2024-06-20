import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import EventModal from "./EventModal";
import Notification from "./Notification"; // Import the Notification component

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
  previous: "Previous",
  next: "Next",
  today: "Current",
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
  date: "Date",
  time: "Time",
  event: "Event",
};

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    reminder: false,
    reminderDays: 0,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null); // State for notification

  useEffect(() => {
    const fetchEvents = () => {
      getDocs(collection(db, "events"))
        .then((querySnapshot) => {
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
        })
        .catch((error) => {
          console.error("Error fetching events: ", error);
        });
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    events.forEach((event) => {
      if (event.reminder) {
        const reminderDate = new Date(event.start);
        reminderDate.setDate(reminderDate.getDate() - event.reminderDays);

        if (reminderDate <= now) {
          setNotification({
            message: `Reminder: ${event.title} is coming up in ${event.reminderDays} day(s).`,
            type: "info",
          });
        }
      }
    });
  }, [events]);

  const handleAddEvent = () => {
    if (newEvent.title === "") {
      setError("Event title is required");
      return;
    }

    if (newEvent.start >= newEvent.end) {
      setError("End date cannot be earlier than or equal to start date.");
      return;
    }

    const eventToSave = {
      ...newEvent,
      start: newEvent.start,
      end: newEvent.end,
    };

    addDoc(collection(db, "events"), eventToSave)
      .then((docRef) => {
        setEvents([...events, { ...eventToSave, id: docRef.id }]);
        setNewEvent({
          title: "",
          start: "",
          end: "",
          reminder: false,
          reminderDays: 0,
        });
        setModalIsOpen(false);
        setSelectedDay(null);
        setError("");
        setNotification({
          message: "Event added successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error adding event: ", error);
        setNotification({
          message: "Error adding event.",
          type: "error",
        });
      });
  };

  const handleUpdateEvent = () => {
    if (newEvent.title === "") {
      setError("Event title is required");
      return;
    }

    if (newEvent.start >= newEvent.end) {
      setError("End date cannot be earlier than or equal to start date.");
      return;
    }

    const updatedEvent = {
      ...newEvent,
      start: newEvent.start,
      end: newEvent.end,
    };

    updateDoc(doc(db, "events", selectedEvent.id), updatedEvent)
      .then(() => {
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id
              ? { ...updatedEvent, id: selectedEvent.id }
              : event
          )
        );
        setNewEvent({
          title: "",
          start: "",
          end: "",
          reminder: false,
          reminderDays: 0,
        });
        setModalIsOpen(false);
        setSelectedDay(null);
        setSelectedEvent(null);
        setError("");
        setNotification({
          message: "Event updated successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error updating event: ", error);
        setNotification({
          message: "Error updating event.",
          type: "error",
        });
      });
  };

  const handleDeleteEvent = (event) => {
    deleteDoc(doc(db, "events", event.id))
      .then(() => {
        setEvents(events.filter((e) => e.id !== event.id));
        setNotification({
          message: "Event deleted successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error deleting event: ", error);
        setNotification({
          message: "Error deleting event.",
          type: "error",
        });
      });
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDay(start);
    setModalIsOpen(true);
    setNewEvent({ title: "", start, end, reminder: false, reminderDays: 0 });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      reminder: event.reminder || false,
      reminderDays: event.reminderDays || 0,
    });
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100vh" }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        messages={messages}
      />
      <EventModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        selectedDay={selectedDay}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        error={error}
        selectedEvent={selectedEvent}
        setSelectedDay={setSelectedDay}
        setSelectedEvent={setSelectedEvent}
        setError={setError}
        locales={locales}
      />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default MyCalendar;
