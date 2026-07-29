import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function CreateExerciseModal({
  isOpen,
  selectedCategory,
  onClose,
  onCreate
}) {

  const [name, setName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");

  const handleClose = () => {

    setName("");
    setError("");

    setMetrics(
      selectedCategory?.defaultMetrics || []
    );

    onClose();
  };

  useBackButtonClose(isOpen, handleClose);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    setMetrics(
      selectedCategory?.defaultMetrics || []
    );
  }, [selectedCategory]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const shouldAutoFocus =
    !window.matchMedia("(pointer: coarse)").matches;

  if (!isOpen) {
    return null;
  }

  const formatExerciseName = (name) =>
    name
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map(
        word =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");

  const toggleMetric = (metric) => {
    setError("");

    setMetrics(current =>
      current.includes(metric)
        ? current.filter(item => item !== metric)
        : [...current, metric]
    );
  };

  const handleSubmit = async () => {

    if (!name.trim()) {
      setError("Exercise name is required.");
      return;
    }

    if (metrics.length === 0) {
      setError("Select at least one metric.")
      return;
    }

    try {

      setError("");

      await onCreate({
        name: formatExerciseName(name),
        metrics
      });

      handleClose();

    } catch (error) {
      setError(error.error || error.message);
    }
  };

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >

        <h2>Create Exercise</h2>

        <p className="modal-category">
          Category: {selectedCategory?.name}
        </p>

        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          autoFocus={shouldAutoFocus}
          placeholder="Exercise name"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <h3>Metrics</h3>

        <MetricSelector
          selectedMetrics={metrics}
          onToggle={toggleMetric}
        />

        {error && (
          <p className="modal-error">
            {error}
          </p>
        )}

        <div className="modal-actions">

          <button
            type="button"
            onClick={handleSubmit}
          >
            Create
          </button>

          <button
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>,
    document.body
  );
}

export default CreateExerciseModal;