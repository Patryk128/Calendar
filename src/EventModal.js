import React, { useEffect } from "react";
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
  handleUpdateEvent,
  handleDeleteEvent,
  error,
  selectedEvent,
  setSelectedDay,
  setSelectedEvent,
  setError,
  locales,
}) => {
  // kliknięcie za modalem
  useEffect(() => {
    const closeModal = () => {
      setModalIsOpen(false);
      setSelectedDay(null);
      setSelectedEvent(null);
      setError("");
    };

    const handleClickOutside = (event) => {
      if (modalIsOpen && !event.target.closest(".modal-content")) {
        closeModal();
      }
    };

    if (modalIsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalIsOpen, setModalIsOpen, setSelectedDay, setSelectedEvent, setError]);

  // zamykanie modala
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDay(null);
    setSelectedEvent(null);
    setError("");
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Add Event"
      className="custom-modal"
      overlayClassName="custom-overlay"
      shouldCloseOnOverlayClick={true}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {selectedEvent ? "Edit Event" : "Add Event"}{" "}
            {selectedDay &&
              format(selectedDay, "MMMM d, yyyy", { locale: locales["en-US"] })}
          </h2>
          <button className="close-button" onClick={closeModal}>
            x
          </button>
        </div>
        <EventForm
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          error={error}
          setError={setError}
          selectedEvent={selectedEvent}
        />
        {selectedEvent && (
          <button
            onClick={() => handleDeleteEvent(selectedEvent)}
            className="event-form-button del-button"
          >
            Delete Event
          </button>
        )}
      </div>
    </Modal>
  );
};

export default EventModal;
