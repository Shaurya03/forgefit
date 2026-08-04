import { estimateOneRepMax } from "./estimateOneRepMax";

export function getWorkoutHistoryWithPRs(workouts) {

  const sortedWorkouts = workouts
    .map(workout => ({
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({ ...set, personalRecords: {} }))
      }))
    }))
    .reverse();

  const exerciseRecords = {};

  sortedWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exerciseId = exercise.exerciseId._id;

      if (!exerciseRecords[exerciseId]) {
        exerciseRecords[exerciseId] = { bestValues: {}, bestDistanceTimes: {} };
      }

      const { bestValues, bestDistanceTimes } = exerciseRecords[exerciseId];

      let bestWeightSet = null;
      let bestRepsSet = null;
      let bestLapsSet = null;
      let bestDistanceSet = null;
      let bestDurationOnlySet = null;
      let bestE1RMSet = null;
      let bestE1RM = -Infinity;

      exercise.sets.forEach(set => {
        const { weight, reps, laps, distance, duration } = set.metrics;

        if (weight != null && (!bestWeightSet || weight > bestWeightSet.metrics.weight)) {
          bestWeightSet = set;
        }

        if (reps != null && (!bestRepsSet || reps > bestRepsSet.metrics.reps)) {
          bestRepsSet = set;
        }

        if (laps != null && (!bestLapsSet || laps > bestLapsSet.metrics.laps)) {
          bestLapsSet = set;
        }

        const e1rm = estimateOneRepMax(weight, reps);
        if (e1rm != null && e1rm > bestE1RM) {
          bestE1RM = e1rm;
          bestE1RMSet = set;
        }

        if (distance != null) {
          if (
            !bestDistanceSet ||
            distance > bestDistanceSet.metrics.distance ||
            (distance === bestDistanceSet.metrics.distance &&
              duration != null &&
              (bestDistanceSet.metrics.duration == null || duration < bestDistanceSet.metrics.duration))
          ) {
            bestDistanceSet = set;
          }
        } else if (duration != null) {
          if (!bestDurationOnlySet || duration > bestDurationOnlySet.metrics.duration) {
            bestDurationOnlySet = set;
          }
        }
      });

      if (bestWeightSet && bestWeightSet.metrics.weight > (bestValues.weight ?? -Infinity)) {
        bestValues.weight = bestWeightSet.metrics.weight;
        bestWeightSet.personalRecords.weight = true;
      }

      if (bestRepsSet && bestRepsSet.metrics.reps > (bestValues.reps ?? -Infinity)) {
        bestValues.reps = bestRepsSet.metrics.reps;
        bestRepsSet.personalRecords.reps = true;
      }

      if (bestLapsSet && bestLapsSet.metrics.laps > (bestValues.laps ?? -Infinity)) {
        bestValues.laps = bestLapsSet.metrics.laps;
        bestLapsSet.personalRecords.laps = true;
      }

      if (bestE1RMSet && bestE1RM > (bestValues.e1rm ?? -Infinity)) {
        bestValues.e1rm = bestE1RM;
        bestE1RMSet.personalRecords.e1rm = true;
      }

      if (bestDistanceSet) {
        const { distance, duration } = bestDistanceSet.metrics;
        if (distance > (bestValues.distance ?? -Infinity)) {
          bestValues.distance = distance;
          bestDistanceTimes[distance] = duration;
          bestDistanceSet.personalRecords.distance = true;
        } else if (duration != null && distance === bestValues.distance) {
          const bestTime = bestDistanceTimes[distance];
          if (bestTime == null || duration < bestTime) {
            bestDistanceTimes[distance] = duration;
            bestDistanceSet.personalRecords.duration = true;
          }
        }
      }

      if (bestDurationOnlySet && bestDurationOnlySet.metrics.duration > (bestValues.duration ?? -Infinity)) {
        bestValues.duration = bestDurationOnlySet.metrics.duration;
        bestDurationOnlySet.personalRecords.duration = true;
      }
    });
  });

  return sortedWorkouts.reverse();
}