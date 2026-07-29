import { useState } from "react";
import { createPortal } from "react-dom";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function CreateCategoryModal({
  isOpen,
  onClose,
  onCreate
}) {
  const [categoryName, setCategoryName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    setCategoryName("");
    setMetrics([]);
    onClose();
  };

  useBackButtonClose(isOpen, handleClose);

  const shouldAutoFocus =
    !window.matchMedia("(pointer: coarse)").matches;

  if (!isOpen) {
    return null;
  }

  const toggleMetric = (metric) => {
    setError("");

    setMetrics(current =>
      current.includes(metric)
        ? current.filter(item => item !== metric)
        : [...current, metric]
    );
  };

  const formatCategoryName = (name) =>
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

  const handleSubmit = async () => {

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    if (metrics.length === 0) {
      setError("Select at least one metric.");
      return;
    }

    try {
      setError("");

      await onCreate({
        name: formatCategoryName(categoryName),
        defaultMetrics: metrics
      });
      setCategoryName("");
      setMetrics([]);

    } catch (error) {
      setError(error.message);
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
        <h2>Create Category</h2>

        <input
          value={categoryName}
          maxLength={40}
          autoFocus={shouldAutoFocus}
          onChange={(event) => {
            setCategoryName(event.target.value);
            setError("");
          }}
          placeholder="Category name"
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
          <button onClick={handleSubmit}>
            Create
          </button>

          <button onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateCategoryModal;