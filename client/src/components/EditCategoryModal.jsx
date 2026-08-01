import { useState, useEffect } from "react";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import MetricSelector from "./MetricSelector";
import AnimatedModal from "./AnimatedModal";
import "./Modal.css";

function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSave
}) {
  const [categoryName, setCategoryName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    setCategoryName(category?.name || "");
    setMetrics(category?.defaultMetrics || []);
    onClose();
  };

  useBackButtonClose(isOpen, handleClose);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setMetrics(category.defaultMetrics || []);
    }
  }, [category]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const shouldAutoFocus =
    !window.matchMedia("(pointer: coarse)").matches;

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

  const toggleMetric = (metric) => {
    setError("");

    setMetrics(current =>
      current.includes(metric)
        ? current.filter(item => item !== metric)
        : [...current, metric]
    );
  };

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

      await onSave({
        name: formatCategoryName(categoryName),
        defaultMetrics: metrics
      });

      setCategoryName("");
      setMetrics([]);

    } catch (error) {
      setError(error.message);
    }

  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={handleClose}>
      <h2>Edit Category</h2>

      <input
        value={categoryName}
        onChange={(event) => {
          setCategoryName(event.target.value)
          setError("");
        }}
        placeholder="Enter Category name"
        maxLength={40}
        autoFocus={shouldAutoFocus}
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
          Save
        </button>

        <button onClick={handleClose}>
          Cancel
        </button>
      </div>
    </AnimatedModal>
  );
};

export default EditCategoryModal;