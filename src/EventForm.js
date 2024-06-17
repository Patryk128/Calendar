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
  const handleStartDateChange = (start) => {
    setNewEvent({ ...newEvent, start });
    if (newEvent.end && start > newEvent.end) {
      setError("Start date cannot be later than end date.");
    } else {
      setError("");
    }
  };

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
          minDate={newEvent.start} // Block dates earlier than the start date
          minTime={
            newEvent.start &&
            newEvent.start.toDateString() === newEvent.end.toDateString()
              ? newEvent.start
              : null
          } // Block times earlier than the start time if the dates are the same
        />
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
