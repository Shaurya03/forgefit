import { format } from 'date-fns';
import WorkoutPreviewContent from './WorkoutPreviewContent';
import AnimatedModal from './AnimatedModal';
import './Modal.css';

function WorkoutPreviewModal({
  isOpen,
  workout,
  onClose,
  onGoToWorkout
}) {

  return (
    <AnimatedModal className="workout-preview-modal" isOpen={isOpen} onClose={onClose}>
      <h2>
        {format(
          new Date(workout.date),
          "EEEE, d MMM yyyy"
        )}
      </h2>

      <p>
        {workout.exercises.length}{" "}
        {workout.exercises.length === 1
          ? "Exercise"
          : "Exercises"}
      </p>

      <div className="workout-preview-body">
        <WorkoutPreviewContent
          workout={workout}
        />
      </div>

      <div className="modal-actions">

        <button
          onClick={onClose}
        >
          Close
        </button>

        <button
          onClick={onGoToWorkout}
        >
          Go To Workout
        </button>

      </div>
    </AnimatedModal>
  );
}

export default WorkoutPreviewModal;