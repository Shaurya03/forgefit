import DatePicker from "react-datepicker";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import AnimatedModal from "./AnimatedModal";
import "./Modal.css";

function DashboardCalendarModal({
  isOpen,
  onClose,
  customRange,
  setCustomRange
}) {

  useBackButtonClose(isOpen, onClose);

  const handleDateChange = ([startDate, endDate]) => {
    setCustomRange({
      startDate,
      endDate
    });

    if (startDate && endDate) {
      onClose();
    }
  };

  return (
    <AnimatedModal className="calendar-modal" isOpen={isOpen} onClose={onClose}>
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
    </AnimatedModal>
  );
}

export default DashboardCalendarModal;