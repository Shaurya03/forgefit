import { useCallback, useEffect, useRef, useState } from "react";
import { METRIC_LABELS } from "../utils/metrics";
import { getMetricConfig } from "../utils/metricConfig";
import { DEFAULT_UNITS } from "../utils/settings";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL, authFetch } from "../services/api";
import { toast } from "react-toastify";
import { UNITS, DISTANCE_SYSTEMS } from "../utils/units";
import { getDisplayMetrics } from "../utils/derivedMetrics";
import { getDisplaySet } from "../utils/getDisplaySet";
import { useSettings } from "../hooks/useSettings";
import { FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { getHistoryWithPRs } from "../utils/prHistory";
import { useNavigate } from "react-router-dom";
import { reactSelectStyles } from "../styles/reactSelectStyles";
import { getInitialSet } from "../utils/getInitialSet";
import { isSameDay } from "date-fns";
import { Backdrop } from "./Backdrop";
import { useBackButtonClose } from "../hooks/useBackButtonClose";
import { isSetPersonalRecord, isStarMetric } from "../utils/prBadges";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "framer-motion";
import { slideVariants } from "../utils/motionVariants";
import MetricValue from "./MetricValue";
import HistoryWorkoutCard from "./HistoryWorkoutCard";
import Select from "react-select";
import "./ExerciseLogger.css";

function ExerciseLogger({
  exercise,
  workoutId,
  workoutDate,
  onBack,
  mode
}) {
  const { workouts, dispatch } = useWorkoutContext();

  const { user } = useAuthContext();

  const { settings } = useSettings();

  const [isDistanceMenuOpen, setIsDistanceMenuOpen] = useState(false);
  useBackButtonClose(isDistanceMenuOpen, () => setIsDistanceMenuOpen(false));

  const navigate = useNavigate();

  const DEFAULT_DISTANCE_UNIT =
    DEFAULT_UNITS[
      settings.distanceSystem
    ].distance;

  const DEFAULT_WEIGHT_UNIT =
    DEFAULT_UNITS[
      settings.weightSystem
    ].weight;

  const [metricValues, setMetricValues] = useState({
    metrics: {},
    inputUnits: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSetIndex, setSelectedSetIndex] = useState(null);

  const [activeTab, setActiveTab] = useState("logger");
  const [tabDirection, setTabDirection] = useState(0);

  const TAB_ORDER = ["logger", "history"];

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setTabDirection(
      TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(activeTab) ? 1 : -1
    );
    setActiveTab(tab);
  };

  const tabSwipeHandlers = useSwipeable({
    onSwipedLeft: () => handleTabChange("history"),
    onSwipedRight: () => handleTabChange("logger"),
    onSwiping: (eventData) => {
      if (Math.abs(eventData.deltaX) > Math.abs(eventData.deltaY)) {
        eventData.event.preventDefault?.();
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    touchEventOptions: { passive: false },
  });

  const firstInputRef = useRef(null);

  const distanceSelectRef = useRef(null);

  const closeDistanceMenu = () => {
    setIsDistanceMenuOpen(false);
    distanceSelectRef.current?.blur();
  };

  const weightUnit =
    metricValues.inputUnits.weight ??
    DEFAULT_WEIGHT_UNIT;

  const distanceUnit =
    metricValues.inputUnits.distance ??
    DEFAULT_DISTANCE_UNIT;

  const initializeInputs = useCallback((set = null) => {

    if (set) {

      setMetricValues(
        getDisplaySet({
          set,
          settings,
          DEFAULT_WEIGHT_UNIT,
          DEFAULT_DISTANCE_UNIT
        })
      );

      return;
    }

    const metrics = {};
    const inputUnits = {};

    if (exercise.metrics.includes("duration")) {
      metrics.duration = {
        hours: "",
        minutes: "",
        seconds: ""
      };
    }

    if (exercise.metrics.includes("weight")) {
      inputUnits.weight = DEFAULT_WEIGHT_UNIT;
    }

    if (exercise.metrics.includes("distance")) {
      inputUnits.distance = DEFAULT_DISTANCE_UNIT;
    }

    setMetricValues({
      metrics,
      inputUnits
    });

  }, [
    exercise,
    settings,
    DEFAULT_WEIGHT_UNIT,
    DEFAULT_DISTANCE_UNIT
  ]);

  let activeWorkout;

  if (workoutId) {
    activeWorkout = workouts.find(
      workout => workout._id === workoutId
    );
  }
  else if (workoutDate) {
    activeWorkout = workouts.find(workout =>
      isSameDay(
        new Date(workout.date),
        new Date(workoutDate)
      )
    );
  }
  else {
    activeWorkout = workouts.find(workout =>
      isSameDay(
        new Date(workout.date),
        new Date()
      )
    );
  }

  const loggedExercise =
    activeWorkout?.exercises.find(
      item =>
        item.exerciseId?._id === exercise._id
    );

  const exerciseHistory = workouts
    .filter(workout =>
      workout.exercises.some(item =>
        item.exerciseId?._id === exercise._id
      )
    )
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  const initialSet = getInitialSet({
    exercise,
    exerciseHistory,
    workoutId,
    workoutDate
  });

  const historyWithPRs = getHistoryWithPRs(

    exerciseHistory.map(workout => {

      const exerciseData = workout.exercises.find(
        item => item.exerciseId._id === exercise._id
      );

      return {
        ...workout,
        sets: exerciseData.sets
      };
    })
  );

  const activeWorkoutWithPRs =
    historyWithPRs.find(
      workout => workout._id === activeWorkout?._id
    );

  const loggedSetsWithPRs =
    activeWorkoutWithPRs?.sets ?? [];


  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {

    if (!exercise) return;

    initializeInputs(initialSet);

  }, [
    exercise,
    initialSet,
    initializeInputs
  ]);

  /* eslint-enable react-hooks/set-state-in-effect */

  if (!exercise) {
    return (
      <div className="exercise-logger empty">
        Select an exercise
      </div>
    );
  }

  const handleMetricChange = (
    metric,
    value
  ) => {
    setError(null);

    if (metric === "duration") {

      setMetricValues(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          duration: {
            ...prev.metrics.duration,
            ...value
          }
        }
      }));

      return;
    }

    setMetricValues(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]:
          value === ""
            ? ""
            : Number(value)
      }
    }));
  };

  const handleUnitChange = (
    metric,
    unit
  ) => {

    setMetricValues(prev => ({
      ...prev,
      inputUnits: {
        ...prev.inputUnits,
        [metric]: unit
      }
    }));
  };

  const adjustMetricValue = (
    metric,
    direction
  ) => {

    let step;

    if (metric === "weight") {
      step =
        UNITS.weight[weightUnit].step;
    }

    else if (metric === "distance") {
      step =
        UNITS.distance[distanceUnit].step;
    }

    else {
      step =
        getMetricConfig(metric).step ?? 1;
    }

    const current =
      Number(
        metricValues.metrics[metric] ?? 0
      );

    let value =
      Math.max(
        0,
        current + direction * step
      );

    if (metric === "weight") {
      value = Number(
        value.toFixed(
          UNITS.weight[weightUnit].precision
        )
      );
    }

    if (metric === "distance") {
      value = Number(
        value.toFixed(
          UNITS.distance[distanceUnit].precision
        )
      );
    }

    setMetricValues(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value
      }
    }));
  };

  const handleSaveSet = async () => {

    if (!user) {
      return;
    }

    const hasEmptyMetric = exercise.metrics.some(metric => {

      if (metric === "duration") {

        const duration =
          metricValues.metrics.duration;

        return (
          !duration ||
          (
            Number(duration.hours || 0) === 0 &&
            Number(duration.minutes || 0) === 0 &&
            Number(duration.seconds || 0) === 0
          )
        );
      }

      return (
        metricValues.metrics[metric] === "" ||
        metricValues.metrics[metric] === undefined
      );
    });

    if (hasEmptyMetric) {
      setError("Please fill all metrics.")
      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      const convertedMetrics = {
        ...metricValues.metrics
      };

      if (
        convertedMetrics.weight !== undefined &&
        convertedMetrics.weight !== ""
      ) {

        const unit =
          DEFAULT_WEIGHT_UNIT;

        convertedMetrics.weight =
          UNITS.weight[unit].toBase(
            convertedMetrics.weight
          );
      }

      if (
        convertedMetrics.distance !== undefined &&
        convertedMetrics.distance !== ""
      ) {

        const unit =
          metricValues.inputUnits.distance;

        convertedMetrics.distance =
          UNITS.distance[unit].toBase(
            convertedMetrics.distance
          );
      }

      if (convertedMetrics.duration) {

        const {
          hours = 0,
          minutes = 0,
          seconds = 0
        } = convertedMetrics.duration;

        convertedMetrics.duration =
          Number(hours) * 3600 +
          Number(minutes) * 60 +
          Number(seconds);
      }

      const newSet = {
        metrics: convertedMetrics,
        inputUnits:
          metricValues.inputUnits
      };

      let workout;
      let method;
      let url;
      let dispatchType;

      if (!activeWorkout) {

        workout = {
          title: "",
          date: workoutDate ?? new Date(),
          exercises: [
            {
              categoryId: exercise.categoryId._id,
              exerciseId: exercise._id,
              sets: [newSet]
            }
          ]
        };

        method = "POST";
        url = `${API_BASE_URL}/workouts`;
        dispatchType = "CREATE_WORKOUT";

      } else {

        workout = JSON.parse(
          JSON.stringify(activeWorkout)
        );

        const existingExercise =
          workout.exercises.find(item => {

            const existingId =
              typeof item.exerciseId === "object"
                ? item.exerciseId._id
                : item.exerciseId;

            return existingId === exercise._id;
          });

        if (existingExercise) {

          existingExercise.sets.push(newSet);

        } else {

          workout.exercises.push({
            categoryId: exercise.categoryId._id,
            exerciseId: exercise._id,
            sets: [newSet]
          });

        }

        if (method === "PATCH") {

          workout.exercises = workout.exercises.map(exercise => ({
            categoryId:
              typeof exercise.categoryId === "object"
                ? exercise.categoryId._id
                : exercise.categoryId,

            exerciseId:
              typeof exercise.exerciseId === "object"
                ? exercise.exerciseId._id
                : exercise.exerciseId,

            sets: exercise.sets
          }));
        }

        method = "PATCH";
        url = `${API_BASE_URL}/workouts/${activeWorkout._id}`;
        dispatchType = "UPDATE_WORKOUT";
      }

      const response = await authFetch(
        url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(workout)
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({
        type: dispatchType,
        payload: json
      });

      setError(null);
      initializeInputs(newSet);

      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

      if (!isTouchDevice) {
        requestAnimationFrame(() => {
          firstInputRef.current?.focus();
        });
      }

    } catch (error) {

      setError(error.message);

    } finally {

      setIsLoading(false);

    }
  };

  const clearInputs = () => {

    setError(null);
    initializeInputs();
    setSelectedSetIndex(null);

    requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });
  };

  const handleSelectSet = (set, index) => {

    setError(null);
    setSelectedSetIndex(index);
    initializeInputs(set);

    requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });
  };

  const handleDeleteSet = async () => {

    const updatedSets =
      loggedExercise.sets.filter(
        (_, index) =>
          index !== selectedSetIndex
      );

    let updatedExercises;

    if (updatedSets.length === 0) {

      updatedExercises =
        activeWorkout.exercises.filter(
          exerciseItem =>
            exerciseItem.exerciseId._id !==
            exercise._id
        );

    } else {

      updatedExercises =
        activeWorkout.exercises.map(exerciseItem => {

          if (
            exerciseItem.exerciseId._id !==
            exercise._id
          ) {
            return exerciseItem;
          }

          return {
            ...exerciseItem,
            sets: updatedSets
          };

        });

    }

    const deleteWorkout =
      updatedExercises.length === 0;

    try {

      const response = await authFetch(
        `${API_BASE_URL}/workouts/${activeWorkout._id}`,
        {
          method:
            deleteWorkout
              ? "DELETE"
              : "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },

          ...(deleteWorkout
            ? {}
            : {
              body: JSON.stringify({
                title: activeWorkout.title,
                date: activeWorkout.date,
                exercises: updatedExercises
              })
            })
        }
      );

      const json =
        deleteWorkout
          ? null
          : await response.json();

      if (!response.ok) {
        toast.error(
          json?.error ??
          "Failed to delete set."
        );
        return;
      }

      dispatch({
        type:
          deleteWorkout
            ? "DELETE_WORKOUT"
            : "UPDATE_WORKOUT",

        payload:
          deleteWorkout
            ? activeWorkout
            : json
      });

      setSelectedSetIndex(null);
      initializeInputs(updatedSets.at(-1));

    } catch {

      toast.error(
        "Failed to delete set."
      );

    }
  };

  const handleUpdateSet = async () => {

    const convertedMetrics = {
      ...metricValues.metrics
    };

    if (convertedMetrics.weight != null) {
      convertedMetrics.weight =
        UNITS.weight[
          DEFAULT_WEIGHT_UNIT
        ].toBase(convertedMetrics.weight);
    }

    if (convertedMetrics.distance != null) {
      convertedMetrics.distance =
        UNITS.distance[
          metricValues.inputUnits.distance
        ].toBase(convertedMetrics.distance);
    }

    if (convertedMetrics.duration != null) {
      const {
        hours = 0,
        minutes = 0,
        seconds = 0
      } = convertedMetrics.duration;

      convertedMetrics.duration =
        Number(hours || 0) * 3600 +
        Number(minutes || 0) * 60 +
        Number(seconds || 0);
    }

    const updatedSet = {
      metrics: convertedMetrics,
      inputUnits: {
        weight: DEFAULT_WEIGHT_UNIT,
        distance: metricValues.inputUnits.distance
      }
    };

    const updatedExercises =
      activeWorkout.exercises.map(exerciseItem => {

        if (
          exerciseItem.exerciseId._id !==
          exercise._id
        ) {
          return exerciseItem;
        }

        return {
          ...exerciseItem,

          sets: exerciseItem.sets.map(
            (set, index) =>
              index === selectedSetIndex
                ? updatedSet
                : set
          )
        };

      });

    try {

      const response = await authFetch(
        `${API_BASE_URL}/workouts/${activeWorkout._id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },

          body: JSON.stringify({
            title: activeWorkout.title,
            date: activeWorkout.date,
            exercises: updatedExercises
          })
        }
      );

      const json =
        await response.json();

      if (!response.ok) {
        toast.error(json.error);
        return;
      }

      dispatch({
        type: "UPDATE_WORKOUT",
        payload: json
      });

      setSelectedSetIndex(null);

    } catch {

      toast.error(
        "Failed to update set."
      );

    }

  };

  return (
    <div className="exercise-logger">

      {/* ---- Fixed top section: header, tabs, and (on the Track tab) the
          metric inputs. This section never scrolls. ---- */}
      <div className="logger-top">
        <div className="logger-header">
          <button
            className="back-btn"
            onClick={() => {
              if (mode === "edit") {
                navigate("/workouts", {
                  state: {
                    selectedDate: workoutDate
                  }
                });
              } else {
                onBack();
              }
            }}
          >
            <FiArrowLeft />
          </button>

          <div className="exercise-info">
            <h2>{exercise.name}</h2>
            <p>{exercise.categoryId?.name}</p>
          </div>
        </div>

        <div className="logger-tabs">
          <button
            className={`logger-tab ${activeTab === "logger" ? "active" : ""}`}
            onClick={() => handleTabChange("logger")}
          >
            Track
          </button>

          <button
            className={`logger-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => handleTabChange("history")}
          >
            History
          </button>
        </div>

        {activeTab === "logger" && (
          <div className="logger-inputs">
            {exercise.metrics.map((metric, index) => {
              const config = getMetricConfig(metric);

              return (
                <div
                  key={metric}
                  className="logger-metric"
                >
                  <div className="logger-metric-label">
                    <span>
                      {METRIC_LABELS[metric]}

                      {metricValues.inputUnits[metric] && (
                        <span className="metric-unit">
                          {" "}
                          ({metricValues.inputUnits[metric]})
                        </span>
                      )}
                    </span>
                  </div>

                  {metric === "duration" ? (
                    <div className="duration-inputs">
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="hh"
                        value={metricValues.metrics.duration?.hours ?? ""}
                        onChange={e =>
                          handleMetricChange(
                            "duration",
                            {
                              hours:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                            }
                          )
                        }
                      />

                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="mm"
                        value={metricValues.metrics.duration?.minutes ?? ""}
                        onChange={e =>
                          handleMetricChange(
                            "duration",
                            {
                              minutes:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                            }
                          )
                        }
                      />

                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="ss"
                        value={metricValues.metrics.duration?.seconds ?? ""}
                        onChange={e =>
                          handleMetricChange(
                            "duration",
                            {
                              seconds:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                            }
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div className="metric-input-row">
                      <button
                        type="button"
                        className="metric-adjust-btn"
                        onClick={() =>
                          adjustMetricValue(
                            metric,
                            -1
                          )
                        }
                      >
                        <FiMinus />
                      </button>

                      <input
                        ref={
                          index === 0
                            ? firstInputRef
                            : null
                        }
                        type="number"
                        inputMode="decimal"
                        value={metricValues.metrics[metric] ?? ""}
                        min={config.min}
                        max={config.max}
                        step={
                          metric === "weight"
                            ? UNITS.weight[weightUnit].step
                            : metric === "distance"
                              ? UNITS.distance[distanceUnit].step
                              : config.step ?? 1
                        }
                        onWheel={e =>
                          e.currentTarget.blur()
                        }
                        onChange={event =>
                          handleMetricChange(
                            metric,
                            event.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="metric-adjust-btn"
                        onClick={() =>
                          adjustMetricValue(
                            metric,
                            1
                          )
                        }
                      >
                        <FiPlus />
                      </button>
                    </div>
                  )}

                  {metric === "distance" && (
                    <div className="distance-unit-select">

                      {isDistanceMenuOpen && (
                        <Backdrop
                          onClose={closeDistanceMenu}
                        />
                      )}
                      <Select
                        ref={distanceSelectRef}
                        value={{
                          value: distanceUnit,
                          label: distanceUnit
                        }}
                        options={DISTANCE_SYSTEMS[settings.distanceSystem].map(unit => ({
                          value: unit,
                          label: unit
                        }))}
                        styles={reactSelectStyles}
                        isSearchable={false}
                        menuIsOpen={isDistanceMenuOpen}
                        onMenuOpen={() => setIsDistanceMenuOpen(true)}
                        onMenuClose={closeDistanceMenu}
                        blurInputOnSelect
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        onChange={(option) => {
                          handleUnitChange("distance", option.value)
                          closeDistanceMenu();
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {error && (
              <p className="logger-error">
                {error}
              </p>
            )}

            {selectedSetIndex === null ? (
              <div className="logger-actions">
                <button
                  className="save-set-btn"
                  onClick={handleSaveSet}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>

                <button
                  className="clear-set-btn"
                  onClick={clearInputs}
                  type="button"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="edit-set-actions">
                <button
                  className="update-set-btn"
                  onClick={handleUpdateSet}
                >
                  Update
                </button>

                <button
                  className="delete-set-btn"
                  onClick={handleDeleteSet}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---- Scrollable bottom section. Only this part scrolls; the
          section above is always visible. ---- */}
      <div className="logger-bottom" {...tabSwipeHandlers}>
        <AnimatePresence mode="wait" custom={tabDirection}>
          <motion.div
            key={activeTab}
            custom={tabDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {activeTab === "logger" && (
              <div className="logged-sets">
                {loggedSetsWithPRs.length === 0 ? (
                  <p className="logged-sets-empty">No sets logged yet.</p>
                ) : (
                  <div className="logged-sets-body">
                    {loggedSetsWithPRs.map((set, index) => {
                      const displayMetrics =
                        getDisplayMetrics(
                          set.metrics,
                          settings.distanceSystem
                        );

                      return (
                        <div
                          key={index}
                          className={`logged-set ${selectedSetIndex === index ? "selected" : ""}`}
                          onClick={() => handleSelectSet(set, index)}
                        >
                          <span className="set-pr-trophy">
                            {isSetPersonalRecord(set) && "⭐"}
                          </span>

                          <div className="set-values">
                            {displayMetrics.map(({ key, value }) => (
                              <span className="set-value" key={key}>
                                <MetricValue
                                  metric={key}
                                  value={value}
                                  settings={settings}
                                  inputUnits={set.inputUnits}
                                  className="logger-metric-value"
                                />

                                {isStarMetric(set, key) && set.personalRecords?.[key] && (
                                  <span className="prs-star">🏆</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="exercise-history">
                {exerciseHistory.length === 0 ? (
                  <p className="logged-sets-empty">No history yet.</p>
                ) : (
                  historyWithPRs.map(workout => (
                    <HistoryWorkoutCard
                      key={workout._id}
                      workout={workout}
                    />
                  ))
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

export default ExerciseLogger;
