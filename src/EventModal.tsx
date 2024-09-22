import React, { useEffect } from "react";
import Modal from "react-modal";
import EventForm from "./EventForm.tsx";
import moment from "moment";

interface EventModalProps {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  selectedDay: Date | null;
  newEvent: {
    title: string;
    start: Date | null;
    end: Date | null;
    reminder: boolean;
    reminderDays: number;
  };
  setNewEvent: (event: any) => void;
  handleAddEvent: () => void;
  handleUpdateEvent: () => void;
  handleDeleteEvent: (event: any) => void;
  error: string;
  selectedEvent: any;
  setSelectedDay: (day: Date | null) => void;
  setSelectedEvent: (event: any) => void;
  setError: (error: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
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
}) => {
  // kliknięcie za modalem
  useEffect(() => {
    const closeModal = () => {
      setModalIsOpen(false);
      setSelectedDay(null);
      setSelectedEvent(null);
      setError("");
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalIsOpen &&
        !(event.target as HTMLElement).closest(".modal-content")
      ) {
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
            {selectedDay && moment(selectedDay).format("MMMM D, YYYY")}
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
