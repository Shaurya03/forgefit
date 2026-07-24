import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "./Modal.css";

function DashboardCalendarModal({
  isOpen,
  onClose,
  customRange,
  setCustomRange
}) {
  if (!isOpen) {
    return null;
  }

  const handleDateChange = ([startDate, endDate]) => {
    setCustomRange({
      startDate,
      endDate
    });

    if (startDate && endDate) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal calendar-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Select Date Range</h2>

        <DatePicker
          inline
          selectsRange
          startDate={customRange.startDate}
          endDate={customRange.endDate}
          onChange={handleDateChange}
          maxDate={new Date()}
          shouldCloseOnSelect={false}
        />

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default DashboardCalendarModal;