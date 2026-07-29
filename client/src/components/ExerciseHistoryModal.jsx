import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSettings } from "../hooks/useSettings";
import { API_BASE_URL, authFetch } from "../services/api";
import { getHistoryWithPRs } from "../utils/prHistory";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import HistoryWorkoutCard from "./HistoryWorkoutCard";
import "./Modal.css";

function ExerciseHistoryModal({
  exerciseId,
  isOpen,
  onClose
}) {

  const { user } = useAuthContext();
  const { settings } = useSettings();

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useBackButtonClose(isOpen, onClose);

  useEffect(() => {

    if (!isOpen || !exerciseId || !user) {
      return;
    }

    const fetchHistory = async () => {

      setIsLoading(true);
      setError(null);
      setHistory([]);

      try {

        const response = await authFetch(
          `${API_BASE_URL}/workouts/exercises/${exerciseId}/history`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
          return;
        }

        setHistory(json);

      } catch {
        setError("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [exerciseId, isOpen, user]);

  if (!isOpen) {
    return null;
  }

  const historyWithPRs = getHistoryWithPRs(
    history,
    settings.distanceSystem
  );

  return createPortal(

    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal history-modal"
        onClick={(event) => event.stopPropagation()}
      >

        <h2>Exercise History</h2>

        <div className="history-modal-content">

          {isLoading && <p>Loading history...</p>}

          {error && <p>{error}</p>}

          {!isLoading &&
            !error &&
            history.length === 0 && (
              <p>No workout history yet.</p>
            )}

          {!isLoading &&
            !error &&
            historyWithPRs.map(workout => (
              <HistoryWorkoutCard
                key={workout.workoutId}
                workout={workout}
              />
            ))}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}

export default ExerciseHistoryModal;