import { useSettings } from "../hooks/useSettings";
import { getDisplayMetrics } from "../utils/derivedMetrics";
import { AnimatePresence, motion } from "framer-motion";
import MetricValue from "./MetricValue";
import "./WorkoutDetails.css";

function WorkoutDetails({
  workout,
  onSelectedExercise
}) {

  const { settings } = useSettings();

  const exerciseCount = workout.exercises?.length || 0;

  const totalSets =
    workout.exercises?.reduce(
      (total, exercise) =>
        total + (exercise.sets?.length || 0),
      0
    ) || 0;

  return (
    <div className="workout-details">

      {workout.title && (
        <h2>{workout.title}</h2>
      )}

      <div className="workout-summary">
        <p>
          {exerciseCount}{" "}
          {exerciseCount === 1 ? "Exercise" : "Exercises"}
          {" • "}
          {totalSets}{" "}
          {totalSets === 1 ? "Set" : "Sets"}
        </p>
      </div>

      <div className="workout-exercise-list">

        {workout.exercises?.length > 0 ? (
          <AnimatePresence>
            {workout.exercises.map((exercise) => {

              const setsWithDisplayMetrics =
                exercise.sets?.map(set => ({
                  ...set,
                  displayMetrics: getDisplayMetrics(
                    set.metrics,
                    settings.distanceSystem
                  )
                })) || [];

              return (

                <motion.div
                  className="workout-exercise-item"
                  key={exercise._id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => onSelectedExercise(workout, exercise)}
                >

                  <h4>{exercise.exerciseId?.name}</h4>

                  <p className="exercise-category">
                    {exercise.exerciseId?.categoryId?.name}
                  </p>

                  <div className="sets-list">

                    {setsWithDisplayMetrics.map((set, setIndex) => (

                      <div
                        className="set-row"
                        key={set._id || setIndex}
                      >

                        {set.displayMetrics.map(metric => (

                          <span
                            key={metric.key}
                            className="set-metric"
                          >

                            <MetricValue
                              metric={metric.key}
                              value={metric.value}
                              settings={settings}
                              inputUnits={set.inputUnits}
                            />

                            {set.personalRecords?.[metric.key] && (
                              <span className="pr-trophies">
                                🏆
                              </span>
                            )}

                          </span>

                        ))}

                      </div>

                    ))}

                  </div>

                </motion.div>

              );
            })}
          </AnimatePresence>

        ) : (

          <p>No exercises found.</p>

        )}

      </div>

    </div>
  );

}

export default WorkoutDetails;