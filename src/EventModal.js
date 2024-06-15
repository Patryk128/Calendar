import React from "react";
import Modal from "react-modal";
import EventForm from "./EventForm";
import format from "date-fns/format";

const EventModal = ({
  modalIsOpen,
  setModalIsOpen,
  selectedDay,
  newEvent,
  setNewEvent,
  handleAddEvent,
  handleDeleteEvent,
  error,
  selectedEvent,
  setSelectedDay,
  setSelectedEvent,
  setError,
  locales,
}) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => {
        setModalIsOpen(false);
        setSelectedDay(null);
        setSelectedEvent(null);
        setError("");
      }}
      contentLabel="Add Event"
      className="custom-modal"
      overlayClassName="custom-overlay"
      ariaHideApp={false}
    >
      <h2>
        {selectedEvent ? "Edit Event" : "Add Event"} for{" "}
        {selectedDay &&
          format(selectedDay, "MMMM d, yyyy", { locale: locales["en-US"] })}
      </h2>
      <EventForm
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        error={error}
        setError={setError}
        selectedEvent={selectedEvent}
      />
      {selectedEvent && (
        <button onClick={() => handleDeleteEvent(selectedEvent)}>
          Delete Event
        </button>
      )}
    </Modal>
  );
};

export default EventModal;
