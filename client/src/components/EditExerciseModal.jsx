import { useState, useEffect } from "react";
import { reactSelectStyles } from "../styles/reactSelectStyles";
import { Backdrop } from "./Backdrop";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import MetricSelector from "./MetricSelector";
import Select from "react-select";
import AnimatedModal from "./AnimatedModal";
import "./Modal.css";

function EditExerciseModal({
  isOpen,
  exercise,
  categories,
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const handleClose = () => {
    setIsCategoryMenuOpen(false);
    setError("");
    setName("");
    setMetrics(exercise?.metrics || []);
    setCategoryId(exercise?.categoryId?._id || "");

    onClose();
  };

  useBackButtonClose(isOpen, handleClose);
  useBackButtonClose(isCategoryMenuOpen, () => setIsCategoryMenuOpen(false));

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (exercise) {
      setMetrics(exercise.metrics || []);
      setName(exercise.name);
      setCategoryId(exercise.categoryId?._id || "");
    }
  }, [exercise]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const shouldAutoFocus =
    !window.matchMedia("(pointer: coarse)").matches;

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
      setError("Exercise name is required.")
      return;
    }

    if (metrics.length === 0) {
      setError("Select at least one metric.")
      return;
    }

    try {
      setError("");

      await onSave({
        name: formatExerciseName(name),
        metrics,
        categoryId
      });

    } catch (error) {
      setError(error.message);
    }
  };

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  const selectedOption =
    categoryOptions.find(
      option => option.value === categoryId
    ) || null;

  return (
    <AnimatedModal isOpen={isOpen} onClose={handleClose}>
      <h2>Edit Exercise</h2>

      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value)
          setError("");
        }}
        autoFocus={shouldAutoFocus}
        placeholder="Enter Exercise name"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSubmit();
          }
        }}
      />

      <label>Category</label>

      {isCategoryMenuOpen && (
        <Backdrop
          onClose={() => setIsCategoryMenuOpen(false)}
        />
      )}
      <Select
        options={categoryOptions}
        value={selectedOption}
        styles={reactSelectStyles}
        menuIsOpen={isCategoryMenuOpen}
        onMenuOpen={() => setIsCategoryMenuOpen(true)}
        onMenuClose={() => setIsCategoryMenuOpen(false)}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        onChange={(option) => {
          setCategoryId(option.value);
          setError("");
        }}
        isSearchable={false}
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

export default EditExerciseModal;