import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import EventModal from "./EventModal";
import Notification from "./Notification";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1, locale: enUS }), // Start week on Monday
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

const MyCalendar = ({ setIsLoggedIn }) => {
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
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

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
    const upcomingNotifications = events
      .filter((event) => event.reminder)
      .map((event) => {
        const reminderDate = new Date(event.start);
        reminderDate.setDate(reminderDate.getDate() - event.reminderDays);
        const daysRemaining = Math.ceil(
          (new Date(event.start) - now) / (1000 * 60 * 60 * 24)
        );
        return {
          message: `Reminder: ${event.title} is coming up in ${daysRemaining} day(s).`,
          type: "info",
          reminderDate,
        };
      })
      .filter((notification) => notification.reminderDate <= now)
      .sort((a, b) => b.reminderDate - a.reminderDate);

    setNotifications(upcomingNotifications);
  }, [events]);

  useEffect(() => {
    if (!currentNotification && notifications.length > 0) {
      setCurrentNotification(notifications[0]);
      setNotifications(notifications.slice(1));
    }
  }, [notifications, currentNotification]);

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
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Event added successfully!",
            type: "success",
          },
        ]);
      })
      .catch((error) => {
        console.error("Error adding event: ", error);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Error adding event.",
            type: "error",
          },
        ]);
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
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Event updated successfully!",
            type: "success",
          },
        ]);
      })
      .catch((error) => {
        console.error("Error updating event: ", error);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Error updating event.",
            type: "error",
          },
        ]);
      });
  };

  const handleDeleteEvent = (event) => {
    deleteDoc(doc(db, "events", event.id))
      .then(() => {
        setEvents(events.filter((e) => e.id !== event.id));
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Event deleted successfully!",
            type: "success",
          },
        ]);
      })
      .catch((error) => {
        console.error("Error deleting event: ", error);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Error deleting event.",
            type: "error",
          },
        ]);
      });
  };

  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (start < now) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: "Cannot add events to past dates.",
          type: "error",
        },
      ]);
      return;
    }

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

  const dayPropGetter = (date) => {
    const today = new Date();
    const isToday = date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (isToday) {
      return { className: "today" };
    } else if (date < today && date >= startOfMonth && date <= endOfMonth) {
      return { className: "past-day" };
    }
    return {};
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            message: "Error logging out. Please try again.",
            type: "error",
          },
        ]);
      });
  };

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
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
        dayPropGetter={dayPropGetter}
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
        setError={setError}
        selectedEvent={selectedEvent}
        setSelectedDay={setSelectedDay}
        setSelectedEvent={setSelectedEvent}
        locales={locales}
      />
      {currentNotification && (
        <Notification
          message={currentNotification.message}
          type={currentNotification.type}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

export default MyCalendar;
