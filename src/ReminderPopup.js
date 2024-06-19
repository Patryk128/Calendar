import React from "react";
import Modal from "react-modal";

const ReminderPopup = ({ event, closeReminderPopup }) => {
  return (
    <Modal
      isOpen={true}
      onRequestClose={closeReminderPopup}
      contentLabel="Reminder"
      className="custom-modal"
      overlayClassName="custom-overlay"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Reminder for Event</h2>
          <button className="close-button" onClick={closeReminderPopup}>
            x
          </button>
        </div>
        <div className="modal-body">
          <p>{`Event: ${event.title}`}</p>
          <p>{`Start: ${event.start.toLocaleString()}`}</p>
          <p>{`End: ${event.end.toLocaleString()}`}</p>
        </div>
        <button className="event-form-button" onClick={closeReminderPopup}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ReminderPopup;
