import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { getDashboardStats } from "../utils/dashboardStats";
import { getPersonalRecords } from "../utils/personalRecords";
import { formatMetric } from "../utils/metricFormatter";
import { useSettings } from "../hooks/useSettings";
import { filterWorkouts } from "../utils/filterWorkouts";
import { getPeriodLabel, getDisableNext, getPreviousPeriodDate, getNextPeriodDate } from "../utils/dashboardNavigation";
import { useNavigate } from "react-router-dom";
import { getWorkoutHistoryWithPRs } from "../utils/workoutPRHistory";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "framer-motion";
import { slideVariants } from "../utils/motionVariants";
import DashboardFilter from "../components/DashboardFilter";
import StatCard from "../components/StatCard";
import PersonalRecordCard from "../components/PersonalRecordCard";
import WorkoutPreviewModal from "../components/WorkoutPreviewModal";
import VolumeChart from "../components/VolumeChart";
import CategoryBreakdownChart from "../components/CategoryBreakdownChart";
import "./Dashboard.css";
import DashboardTabs from "../components/DashboardTabs";

function Dashboard() {
  const { workouts } = useWorkoutContext();

  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: ""
  });

  const [activeTab, setActiveTab] = useState("overview");

  const [direction, setDirection] = useState(0);

  const navigate = useNavigate();

  const getDefaultCustomRange = useCallback(() => {
    const endDate = new Date();

    if (!workouts?.length) {
      return {
        startDate: new Date(),
        endDate
      };
    }

    return {
      startDate: new Date(
        Math.min(
          ...workouts.map(workout => new Date(workout.date))
        )
      ),
      endDate
    };
  }, [workouts]);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    setCustomRange(getDefaultCustomRange());
  }, [getDefaultCustomRange]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const { settings } = useSettings();

  const filteredWorkouts = filterWorkouts(
    workouts,
    selectedPeriod,
    selectedDate,
    customRange
  );

  const workoutsWithPRs = useMemo(
    () => getWorkoutHistoryWithPRs(filteredWorkouts),
    [filteredWorkouts]
  );

  const periodLabel = getPeriodLabel(
    selectedPeriod,
    selectedDate
  );

  const disableNext = getDisableNext(
    selectedPeriod,
    selectedDate
  );

  const goToPrevious = () => {
    setDirection(-1);
    setSelectedDate(date =>
      getPreviousPeriodDate(
        selectedPeriod,
        date
      )
    );
  };

  const goToNext = () => {
    setDirection(1);
    setSelectedDate(date =>
      getNextPeriodDate(
        selectedPeriod,
        date
      )
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => { if (!disableNext) goToNext(); },
    onSwipedRight: () => goToPrevious(),
    onSwiping: (eventData) => {
      // only block the page scroll if the swipe is clearly horizontal
      if (Math.abs(eventData.deltaX) > Math.abs(eventData.deltaY)) {
        eventData.event.preventDefault?.();
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    touchEventOptions: { passive: false },
  });

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    setSelectedDate(new Date());

    if (newPeriod === "custom") {
      setCustomRange(getDefaultCustomRange());
    }
  };

  const stats = getDashboardStats(filteredWorkouts);

  const prs = getPersonalRecords(filteredWorkouts);

  const openWorkoutPreview = (workoutId) => {
    const workout = workoutsWithPRs.find(
      workout => workout._id === workoutId
    );

    setSelectedWorkout(workout);
  }

  return (
    <div className="dashboard">

      <div className="dashboard-top">

        <h2 className="dashboard-title">Dashboard</h2>

        <DashboardFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          periodLabel={periodLabel}
          onPrevious={goToPrevious}
          onNext={goToNext}
          disableNext={disableNext}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

      </div>

      <div className="dashboard-body" {...swipeHandlers}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${activeTab}-${periodLabel}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >

            {activeTab === "overview" && (
              <>
                <div className="stats-grid">

                  <StatCard
                    title="Total Workouts"
                    value={stats.totalWorkouts}
                  />

                  <StatCard
                    title="Exercises"
                    value={stats.totalExercises}
                  />

                  <StatCard
                    title="Sets"
                    value={stats.totalSets}
                  />

                  <StatCard
                    title="Reps"
                    value={stats.totalReps}
                  />

                  <StatCard
                    title="Top Category"
                    value={stats.mostTrainedCategory}
                  />

                  <StatCard
                    title="Volume"
                    value={formatMetric(
                      "weight",
                      stats.totalVolume,
                      settings
                    )}
                  />

                  <StatCard
                    title="Total Distance"
                    value={formatMetric(
                      "distance",
                      stats.totalDistance,
                      settings
                    )}
                  />

                  <StatCard
                    title="Total Duration"
                    value={formatMetric(
                      "duration",
                      stats.totalDuration,
                      settings
                    )}
                  />

                </div>
              </>
            )}

            {activeTab === "records" && (
              <>
                <div className="stats-grid">

                  <PersonalRecordCard
                    title="Highest Weight"
                    value={formatMetric(
                      "weight",
                      prs.highestWeightRecord?.value || 0,
                      settings
                    )}
                    exercise={prs.highestWeightRecord?.exerciseName || "None"}
                    workout={prs.highestWeightRecord?.title}
                    date={
                      prs.highestWeightRecord.date
                        ?
                        format(new Date(prs.highestWeightRecord?.date), "d MMM yyyy")
                        :
                        "No Date"
                    }
                    onViewWorkout={() =>
                      openWorkoutPreview(prs.highestWeightRecord?.id)
                    }
                  />

                  <PersonalRecordCard
                    title="Highest Reps"
                    value={prs.highestRepsRecord?.value || 0}
                    exercise={prs.highestRepsRecord?.exerciseName || "None"}
                    workout={prs.highestRepsRecord?.title}
                    date={
                      prs.highestRepsRecord.date
                        ?
                        format(new Date(prs.highestRepsRecord?.date), "d MMM yyyy")
                        :
                        "No Date"
                    }
                    onViewWorkout={() =>
                      openWorkoutPreview(prs.highestRepsRecord?.id)
                    }
                  />

                  <PersonalRecordCard
                    title="Longest Distance"
                    value={formatMetric(
                      "distance",
                      prs.longestDistanceRecord?.value || 0,
                      settings
                    )}
                    exercise={prs.longestDistanceRecord.exerciseName || "None"}
                    workout={prs.longestDistanceRecord?.title}
                    date={
                      prs.longestDistanceRecord.date
                        ?
                        format(new Date(prs.longestDistanceRecord?.date), "d MMM yyyy")
                        :
                        "No Date"
                    }
                    onViewWorkout={() =>
                      openWorkoutPreview(prs.longestDistanceRecord?.id)
                    }
                  />

                  <PersonalRecordCard
                    title="Longest Duration"
                    value={formatMetric(
                      "duration",
                      prs.longestDurationRecord?.value || 0,
                      settings
                    )}
                    exercise={prs.longestDurationRecord.exerciseName || "None"}
                    workout={prs.longestDurationRecord?.title}
                    date={
                      prs.longestDurationRecord.date
                        ?
                        format(new Date(prs.longestDurationRecord?.date), "d MMM yyyy")
                        :
                        "No Date"
                    }
                    onViewWorkout={() =>
                      openWorkoutPreview(prs.longestDurationRecord?.id)
                    }
                  />

                  <PersonalRecordCard
                    title="Most Exercises"
                    value={prs.mostExercisesRecord?.value || 0}
                    workout={prs.mostExercisesRecord?.title}
                    date={
                      prs.mostExercisesRecord.date
                        ?
                        format(new Date(prs.mostExercisesRecord?.date), "d MMM yyyy")
                        :
                        "No Date"
                    }
                    onViewWorkout={() =>
                      openWorkoutPreview(prs.mostExercisesRecord?.id)
                    }
                  />

                  <PersonalRecordCard
                    title="Highest Volume Workout"
                    value={formatMetric(
                      "weight",
                      prs.highestVolumeRecord?.volume || 0,
                      settings
                    )}
                    workout={prs.highestVolumeRecord?.title}
                    date={
                      prs.highestVolumeRecord.date
                        ?
                        format(new Date(prs.highestVolumeRecord?.date), "d MMM yyyy")
                        :
                        "No Date"
                    }
                    onViewWorkout={() =>
                      openWorkoutPreview(prs.highestVolumeRecord?.id)
                    }
                  />

                </div>

                {selectedWorkout && (
                  <WorkoutPreviewModal
                    isOpen={!!selectedWorkout}
                    workout={selectedWorkout}
                    onClose={() => setSelectedWorkout(null)}
                    onGoToWorkout={() => {
                      navigate("/workouts", {
                        state: {
                          selectedDate: selectedWorkout.date
                        }
                      });

                      setSelectedWorkout(null);
                    }}
                  />
                )}

              </>
            )}

            {activeTab === "charts" && (
              <>
                <div className="charts-section">
                  <CategoryBreakdownChart workouts={filteredWorkouts} />
                  <VolumeChart workouts={filteredWorkouts} />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>

  );
}

export default Dashboard;