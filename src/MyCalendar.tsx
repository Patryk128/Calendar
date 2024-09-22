import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { auth, db } from "./firebase.tsx";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import EventModal from "./EventModal.tsx";
import Notification from "./Notification";

const localizer = momentLocalizer(moment);

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

interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  reminder: boolean;
  reminderDays: number;
}

interface MyCalendarProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ setIsLoggedIn }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: new Date(),
    end: new Date(),
    reminder: false,
    reminderDays: 0,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string>("");
  const [notifications, setNotifications] = useState<
    { message: string; type: string; reminderDate: Date }[]
  >([]);
  const [currentNotification, setCurrentNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsList = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Event;
          return {
            id: doc.id,
            ...data,
            start: data.start ? new Date(data.start) : new Date(),
            end: data.end ? new Date(data.end) : new Date(),
          };
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    const upcomingNotifications = events
      .filter((event) => event.reminder && new Date(event.start) >= now)
      .map((event) => {
        const reminderDate = new Date(event.start);
        reminderDate.setDate(reminderDate.getDate() - event.reminderDays);
        const daysRemaining = Math.ceil(
          (new Date(event.start).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
          message: `Reminder: ${event.title} is coming up in ${daysRemaining} day(s).`,
          type: "info",
          reminderDate,
        };
      })
      .filter((notification) => notification.reminderDate <= now)
      .sort((a, b) => b.reminderDate.getTime() - a.reminderDate.getTime());

    setNotifications(upcomingNotifications);
  }, [events]);

  useEffect(() => {
    if (!currentNotification && notifications.length > 0) {
      setCurrentNotification(notifications[0]);
      setNotifications(notifications.slice(1));
    }
  }, [notifications, currentNotification]);

  const handleAddEvent = async () => {
    if (newEvent.title === "") {
      setError("Event title is required");
      return;
    }

    if (newEvent.start >= newEvent.end) {
      setError("End date cannot be earlier than or equal to start date.");
      return;
    }

    const eventToSave = { ...newEvent };

    try {
      const docRef = await addDoc(collection(db, "events"), eventToSave);
      setEvents([...events, { ...eventToSave, id: docRef.id }]);
      setNewEvent({
        title: "",
        start: new Date(),
        end: new Date(),
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
    } catch (error) {
      console.error("Error adding event: ", error);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: "Error adding event.",
          type: "error",
        },
      ]);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    if (newEvent.title === "") {
      setError("Event title is required");
      return;
    }

    if (newEvent.start >= newEvent.end) {
      setError("End date cannot be earlier than or equal to start date.");
      return;
    }

    const updatedEvent = { ...newEvent };

    try {
      await updateDoc(doc(db, "events", selectedEvent.id!), updatedEvent);
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id
            ? { ...updatedEvent, id: selectedEvent.id }
            : event
        )
      );
      setNewEvent({
        title: "",
        start: new Date(),
        end: new Date(),
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
    } catch (error) {
      console.error("Error updating event: ", error);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: "Error updating event.",
          type: "error",
        },
      ]);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      await deleteDoc(doc(db, "events", event.id!));
      setEvents(events.filter((e) => e.id !== event.id));
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: "Event deleted successfully!",
          type: "success",
        },
      ]);
    } catch (error) {
      console.error("Error deleting event: ", error);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: "Error deleting event.",
          type: "error",
        },
      ]);
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    setSelectedDay(start);
    setModalIsOpen(true);
    setNewEvent({ title: "", start, end, reminder: false, reminderDays: 0 });
  };

  const handleSelectEvent = (event: Event) => {
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

  const dayPropGetter = (date: Date) => {
    const today = new Date();
    const isToday = moment(date).isSame(today, "day");

    if (isToday) {
      return { className: "today" };
    } else if (date < today) {
      return { className: "past-day" };
    }
    return {};
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out: ", error);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: "Error logging out. Please try again.",
          type: "error",
        },
      ]);
    }
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
