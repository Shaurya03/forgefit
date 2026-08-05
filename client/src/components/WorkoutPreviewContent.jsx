import { getDisplayMetrics } from "../utils/derivedMetrics";
import { isSetPersonalRecord, isStarMetric } from "../utils/prBadges";
import MetricValue from "./MetricValue";
import { useSettings } from "../hooks/useSettings";

import "./WorkoutPreviewContent.css";

function WorkoutPreviewContent({ workout }) {

  const { settings } = useSettings();

  return (

    <div className="workout-preview-content">

      {workout.exercises.map((exercise, index) => {

        const category =
          exercise.exerciseId?.categoryId?.name;

        return (

          <div
            className="preview-exercise"
            key={`${exercise.exerciseId?._id}-${index}`}
          >

            <div className="preview-header">

              <h4>
                {exercise.exerciseId?.name}
              </h4>

              <span className="preview-category">
                {category}
              </span>

            </div>

            <div className="preview-sets">

              {exercise.sets.map((set, setIndex) => {

                const displayMetrics =
                  getDisplayMetrics(
                    set.metrics,
                    settings.distanceSystem
                  );

                return (

                  <div
                    className="preview-set-row"
                    key={set._id || setIndex}
                  >

                    <span className="preview-pr-trophy">
                      {isSetPersonalRecord(set) && "⭐"}
                    </span>

                    <div className="preview-set">

                      {displayMetrics.map(metric => (

                        <span
                          key={metric.key}
                          className="preview-metric"
                        >

                          <MetricValue
                            metric={metric.key}
                            value={metric.value}
                            settings={settings}
                            inputUnits={set.inputUnits}
                          />

                          {isStarMetric(set, metric.key) && set.personalRecords?.[metric.key] && (
                            <span className="pr-trophies">
                              🏆
                            </span>
                          )}

                        </span>

                      ))}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default WorkoutPreviewContent;