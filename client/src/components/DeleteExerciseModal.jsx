import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import "./Modal.css";

function DeleteExerciseModal({
  isOpen,
  exercise,
  onClose,
  onDelete
}) {

  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  useBackButtonClose(isOpen, handleClose);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
    }
  }, [isOpen]);

  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) {
    return null;
  }

  const handleDelete = () => {
    onDelete();
  };

  const workoutCount =
    exercise?.workoutCount || 0;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >

        <h2>Delete Exercise</h2>

        <p>
          Are you sure you want to permanently delete
          <strong> "{exercise?.name}"</strong>?
        </p>

        {workoutCount > 0 ? (
          <>
            <div className="modal-warning">
              <strong>⚠ Warning</strong>

              <p>
                This exercise is used in{" "}
                <strong>{workoutCount}</strong>{" "}
                {workoutCount === 1 ? "workout" : "workouts"}.
              </p>
            </div>

            <p>
              Deleting this exercise will:
            </p>

            <ul className="delete-warning-list">
              <li>
                Remove it from those workouts.
              </li>

              <li>
                Delete any workouts that become empty.
              </li>

              <li>
                Remove its personal records and exercise history.
              </li>

              <li>
                This action cannot be undone.
              </li>
            </ul>
          </>
        ) : (
          <p>
            This exercise has not been used in any workouts.
            It will be permanently deleted and this action
            cannot be undone.
          </p>
        )}

        <div className="delete-confirmation">
          <input
            id="confirm-delete"
            type="checkbox"
            checked={confirmed}
            onChange={(event) =>
              setConfirmed(event.target.checked)
            }
          />

          <label htmlFor="confirm-delete">
            I understand this action is permanent.
          </label>
        </div>

        <div className="modal-actions">

          <button
            onClick={handleDelete}
            disabled={!confirmed}
          >
            Delete
          </button>

          <button onClick={handleClose}>
            Cancel
          </button>

        </div>

      </div>
    </div>,
    document.body
  );
}

export default DeleteExerciseModal;