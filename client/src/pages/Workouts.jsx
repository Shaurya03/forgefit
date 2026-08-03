import { useState, useMemo } from "react";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  startOfDay,
  isAfter,
  isYesterday
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiPlus } from "react-icons/fi";
import { getWorkoutHistoryWithPRs } from "../utils/workoutPRHistory";
import { useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "framer-motion";
import { slideVariants } from "../utils/motionVariants";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutCalendarModal from "../components/WorkoutCalendarModal";
import "./Workouts.css";

function Workouts() {
  const {
    workouts,
    isLoading,
    error
  } = useWorkoutContext();

  const navigate = useNavigate();

  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate
      ? startOfDay(new Date(location.state.selectedDate))
      : startOfDay(new Date())
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [direction, setDirection] = useState(0);

  const syncDateToHistory = () => {
    navigate(location.pathname, { replace: true, state: { selectedDate } });
  };

  const workoutsWithPRs = useMemo(
    () => getWorkoutHistoryWithPRs(workouts),
    [workouts]
  );

  const currentWorkout =
    workoutsWithPRs.find(workout =>
      isSameDay(
        new Date(workout.date),
        selectedDate
      )
    );

  const handleExerciseClick = (workout, exercise) => {
    syncDateToHistory();
    navigate("/exercises", {
      state: {
        selectedExerciseId: exercise.exerciseId._id,
        workoutId: workout._id,
        workoutDate: workout.date,
        mode: "edit"
      }
    });
  };

  const handleAddExercise = (workout) => {
    syncDateToHistory();
    navigate("/exercises", {
      state: {
        workoutId: workout._id,
        workoutDate: workout.date,
        mode: "add",
        startFresh: true
      }
    });

  };

  const handlePrevious = () => {
    setDirection(-1);
    setSelectedDate(date =>
      subDays(date, 1)
    );
  };

  const handleNext = () => {
    const today = startOfDay(new Date());
    setDirection(1);
    setSelectedDate(date => {
      const nextDate = startOfDay(addDays(date, 1));

      return isAfter(nextDate, today)
        ? date
        : nextDate;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => { if (!isSameDay(selectedDate, new Date())) handleNext(); },
    onSwipedRight: () => handlePrevious(),
    onSwiping: (eventData) => {
      if (Math.abs(eventData.deltaX) > Math.abs(eventData.deltaY)) {
        eventData.event.preventDefault?.();
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    touchEventOptions: { passive: false },
  });

  if (isLoading) {
    return (
      <div className="workouts-page">
        <div className="loading">
          Loading workouts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workouts-page">
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  const workoutDateLabel = isSameDay(selectedDate, new Date())
    ? "Today"
    : isYesterday(selectedDate)
      ? "Yesterday"
      : format(selectedDate, "EEEE, MMM d");

  return (
    <div className="workouts-page">

      <div className="workouts-header">

        <div className="page-header">
          <h2>Workouts</h2>
        </div>

        <div className="workout-navigation">

          <button
            onClick={handlePrevious}
            className="nav-btn"
          >
            <FiChevronLeft />
          </button>

          <h3 className="workout-date">
            {workoutDateLabel}
          </h3>

          <button
            className="nav-btn"
            onClick={() => setIsCalendarOpen(true)}
          >
            <FiCalendar />
          </button>

          <button
            onClick={handleNext}
            className="nav-btn"
            disabled={isSameDay(selectedDate, new Date())}
          >
            <FiChevronRight />
          </button>

        </div>

      </div>

      <div className="workouts-body" {...swipeHandlers}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={selectedDate.toISOString()} custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>

            {!currentWorkout ? (

              <div className="empty-workout-log">

                <h2>No workout logged</h2>

                <button
                  className="primary-btn"
                  onClick={() => {
                    syncDateToHistory();
                    navigate("/exercises", {
                      state: {
                        workoutDate: selectedDate,
                        startFresh: true
                      }
                    })
                  }}
                >
                  Start Workout
                </button>

              </div>

            ) : (

              <WorkoutDetails
                workout={currentWorkout}
                onSelectedExercise={handleExerciseClick}
                onAddExercise={handleAddExercise}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentWorkout && (
        <button
          className="add-exercise-workout-btn"
          onClick={() => handleAddExercise(currentWorkout)}
        >
          <FiPlus size={28} />
        </button>
      )}

      <WorkoutCalendarModal
        isOpen={isCalendarOpen}
        workouts={workoutsWithPRs}
        onSelectWorkoutDate={(date) => {
          setSelectedDate(date);
          setIsCalendarOpen(false);
        }}
        onClose={() => setIsCalendarOpen(false)}
      />

    </div>

  );
}

export default Workouts;