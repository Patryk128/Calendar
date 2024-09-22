import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventFormProps {
  newEvent: {
    title: string;
    start: Date | null;
    end: Date | null;
    reminder: boolean;
    reminderDays: number;
  };
  setNewEvent: React.Dispatch<React.SetStateAction<any>>;
  handleAddEvent: () => void;
  handleUpdateEvent: () => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  selectedEvent: any;
}

const EventForm: React.FC<EventFormProps> = ({
  newEvent,
  setNewEvent,
  handleAddEvent,
  handleUpdateEvent,
  error,
  setError,
  selectedEvent,
}) => {
  // Handling start date and time change
  const handleStartDateChange = (start: Date) => {
    // Automatically set end time to 1 hour later if end is null or earlier
    let newEnd = newEvent.end;
    if (!newEnd || start >= newEnd) {
      newEnd = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later
    }

    setNewEvent({ ...newEvent, start, end: newEnd });
    setError("");
  };

  // Handling end date and time change
  const handleEndDateChange = (end: Date) => {
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
        {/* Start DatePicker */}
        <DatePicker
          placeholderText="Start Date"
          selected={newEvent.start}
          onChange={handleStartDateChange}
          showTimeSelect
          timeFormat="HH:mm" // 24-hour format
          timeIntervals={60}
          dateFormat="MMMM d, yyyy HH:mm" // 24-hour format
          timeCaption="time"
        />

        {/* End DatePicker */}
        <DatePicker
          placeholderText="End Date"
          selected={newEvent.end}
          onChange={handleEndDateChange}
          showTimeSelect
          timeFormat="HH:mm" // 24-hour format
          timeIntervals={60}
          dateFormat="MMMM d, yyyy HH:mm" // 24-hour format
          timeCaption="time"
        />

        {/* Reminder Section */}
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
                  setNewEvent({
                    ...newEvent,
                    reminderDays: parseInt(e.target.value, 10),
                  })
                }
                min="0"
              />
            </div>
          )}
        </div>
        {/* Save Event Button */}
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
