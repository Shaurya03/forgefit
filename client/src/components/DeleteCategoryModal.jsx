import { useBackButtonClose } from "../hooks/useBackButtonClose";
import AnimatedModal from "./AnimatedModal";
import "./Modal.css";

function DeleteCategoryModal({
  isOpen,
  category,
  error,
  onClose,
  onDelete
}) {

  const handleClose = () => {
    onClose();
  };

  useBackButtonClose(isOpen, handleClose);

  const handleDelete = () => {
    onDelete();
  }

  return (
    <AnimatedModal isOpen={isOpen} onClose={handleClose}>
      <h2>Delete Category</h2>

      {!error ? (
        <>
          <p>
            Are you sure you want to delete
            <strong> "{category?.name}"</strong>?
          </p>

          <div className="modal-actions">
            <button onClick={handleDelete}>
              Delete
            </button>

            <button onClick={handleClose}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="delete-warning">
            <h3>⚠ Cannot delete category</h3>

            <p>
              This category contains{" "}
              <strong>{error.exerciseCount}</strong>{" "}
              {error.exerciseCount === 1
                ? "exercise"
                : "exercises"}.
            </p>

            <p>
              Move the exercises to another category or delete them first.
            </p>
          </div>

          <div className="modal-actions">
            <button onClick={handleClose}>
              OK
            </button>
          </div>
        </>
      )
      }
    </AnimatedModal>
  );
};

export default DeleteCategoryModal;