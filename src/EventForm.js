import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventForm = ({
  newEvent,
  setNewEvent,
  handleAddEvent,
  handleUpdateEvent,
  error,
  setError,
  selectedEvent,
}) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const today = new Date();

  useEffect(() => {
    if (initialLoad && !newEvent.start) {
      const now = new Date();
      setNewEvent({
        ...newEvent,
        start: now,
        end: now,
      });
      setInitialLoad(false);
    }
  }, [newEvent, setNewEvent, initialLoad]);

  // Ustawienie daty rozpoczęcia
  const handleStartDateChange = (date) => {
    const updatedStart = new Date(newEvent.start);
    updatedStart.setFullYear(date.getFullYear());
    updatedStart.setMonth(date.getMonth());
    updatedStart.setDate(date.getDate());

    setNewEvent({ ...newEvent, start: updatedStart });
    setError("");
  };

  // Ustawienie godziny rozpoczęcia przez wpisanie ręczne
  const handleStartTimeInputChange = (e) => {
    const time = e.target.value.split(":"); // Rozdziel godziny i minuty
    const updatedStart = new Date(newEvent.start);
    updatedStart.setHours(parseInt(time[0]), parseInt(time[1]));

    setNewEvent({ ...newEvent, start: updatedStart });
    setError("");
  };

  // Ustawienie daty zakończenia
  const handleEndDateChange = (date) => {
    const updatedEnd = new Date(newEvent.end);
    updatedEnd.setFullYear(date.getFullYear());
    updatedEnd.setMonth(date.getMonth());
    updatedEnd.setDate(date.getDate());

    setNewEvent({ ...newEvent, end: updatedEnd });
    if (newEvent.start && updatedEnd < new Date(newEvent.start)) {
      setError("End date cannot be earlier than start date.");
    } else {
      setError("");
    }
  };

  // Ustawienie godziny zakończenia przez wpisanie ręczne
  const handleEndTimeInputChange = (e) => {
    const time = e.target.value.split(":"); // Rozdziel godziny i minuty
    const updatedEnd = new Date(newEvent.end);
    updatedEnd.setHours(parseInt(time[0]), parseInt(time[1]));

    setNewEvent({ ...newEvent, end: updatedEnd });
    if (newEvent.start && updatedEnd < new Date(newEvent.start)) {
      setError("End date cannot be earlier than start date.");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <div className="form__title">
        <label>Event Title:</label>
        <input
          type="text"
          placeholder="Enter title"
          value={newEvent.title}
          onChange={(e) => {
            setNewEvent({ ...newEvent, title: e.target.value });
            if (e.target.value.trim()) {
              setError("");
            }
          }}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="datepicker-wrapper">
        {/* Wrapper for Start Date and Time */}
        <div className="date-time-wrapper">
          {/* Date Input for Start Date */}
          <div>
            <label>Start Date:</label>
            <DatePicker
              selected={newEvent.start}
              onChange={handleStartDateChange}
              dateFormat="MMMM d, yyyy"
            />
          </div>

          {/* Time Input for Start Time (manual input) */}
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              value={newEvent.start ? newEvent.start.toTimeString().slice(0, 5) : ""}
              onChange={handleStartTimeInputChange}
            />
          </div>
        </div>

        {/* Wrapper for End Date and Time */}
        <div className="date-time-wrapper">
          {/* Date Input for End Date */}
          <div>
            <label>End Date:</label>
            <DatePicker
              selected={newEvent.end}
              onChange={handleEndDateChange}
              dateFormat="MMMM d, yyyy"
              minDate={newEvent.start}
            />
          </div>

          {/* Time Input for End Time (manual input) */}
          <div>
            <label>End Time:</label>
            <input
              type="time"
              value={newEvent.end ? newEvent.end.toTimeString().slice(0, 5) : ""}
              onChange={handleEndTimeInputChange}
            />
          </div>
        </div>

        <div className="reminder-wrapper">
          <label>
            <input
              type="checkbox"
              checked={newEvent.reminder}
              onChange={(e) =>
                setNewEvent({ ...newEvent, reminder: e.target.checked })
              }
            />
            Set Reminder
          </label>
          {newEvent.reminder && (
            <div>
              <label>Days before event:</label>
              <input
                type="number"
                value={newEvent.reminderDays}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, reminderDays: e.target.value })
                }
                min="0"
              />
            </div>
          )}
        </div>
        <button
          onClick={selectedEvent ? handleUpdateEvent : handleAddEvent}
          className={`event-form-button ${
            selectedEvent ? "update-event" : "add-event"
          }`}
        >
          {selectedEvent ? "Update Event" : "Add Event"}
        </button>
      </div>
    </div>
  );
};

export default EventForm;
