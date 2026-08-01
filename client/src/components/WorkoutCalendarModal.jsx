import { useBackButtonClose } from '../hooks/useBackButtonClose';
import DatePicker from "react-datepicker";
import AnimatedModal from './AnimatedModal';
import './Modal.css';

function WorkoutCalendarModal({
  isOpen,
  onClose,
  workouts,
  onSelectWorkoutDate
}) {

  useBackButtonClose(isOpen, onClose);

  const workoutDates =
    workouts.map(workout =>
      new Date(workout.date)
    );

  const handleDateChange = (date) => {
    onSelectWorkoutDate(date);
    onClose();
  };

  return (
    <AnimatedModal className="calendar-modal" isOpen={isOpen} onClose={onClose}>

      <h2>Workout Calendar</h2>

      <DatePicker
        inline
        highlightDates={workoutDates}
        onChange={handleDateChange}
        maxDate={new Date()}
      />

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>

    </AnimatedModal>
  );
}

export default WorkoutCalendarModal;