import React from "react";
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
  // data rozpoczęcia
  const handleStartDateChange = (start) => {
    setNewEvent({ ...newEvent, start });
    if (newEvent.end && start > newEvent.end) {
      setError("Start date cannot be later than end date.");
    } else {
      setError("");
    }
  };

  // data zakończenia
  const handleEndDateChange = (end) => {
    setNewEvent({ ...newEvent, end });
    if (newEvent.start && end < newEvent.start) {
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
        <DatePicker
          placeholderText="Start Date"
          selected={newEvent.start}
          onChange={handleStartDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm"
          timeCaption="time"
        />
        <DatePicker
          placeholderText="End Date"
          selected={newEvent.end}
          onChange={handleEndDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          dateFormat="MMMM d, yyyy h:mm"
          timeCaption="time"
          minDate={newEvent.start}
          minTime={
            newEvent.start &&
            newEvent.start.toDateString() === newEvent.end.toDateString()
              ? newEvent.start
              : null
          }
        />
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
