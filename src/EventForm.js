import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventForm = ({
  newEvent,
  setNewEvent,
  handleAddEvent,
  error,
  setError,
  selectedEvent,
}) => {
  return (
    <div>
      <div className="form-group">
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
          className="form-control"
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <DatePicker
        placeholderText="Start Date"
        selected={newEvent.start}
        onChange={(start) => setNewEvent({ ...newEvent, start })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeCaption="time"
        className="form-control"
      />
      <DatePicker
        placeholderText="End Date"
        selected={newEvent.end}
        onChange={(end) => setNewEvent({ ...newEvent, end })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeCaption="time"
        className="form-control"
      />
      <button onClick={handleAddEvent}>
        {selectedEvent ? "Update Event" : "Add Event"}
      </button>
    </div>
  );
};

export default EventForm;
