import { estimateOneRepMax } from "./estimateOneRepMax";
import { estimatePace } from "./estimatePace";

export function getHistoryWithPRs(history) {

  const sortedHistory = history
    .map(workout => ({
      ...workout,
      sets: workout.sets.map(set => ({
        ...set,
        personalRecords: {}
      }))
    }))
    .reverse();

  const bestValues = {};

  sortedHistory.forEach(workout => {

    let bestWeightSet = null;
    let bestRepsSet = null;
    let bestLapsSet = null;
    let bestDistanceSet = null;
    let bestDurationOnlySet = null;
    let bestE1RMSet = null;
    let bestE1RM = -Infinity;
    let bestPaceSet = null;
    let bestPace = Infinity;

    workout.sets.forEach(set => {
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

      // Distance: farthest ever, independent of pace
      if (distance != null && (!bestDistanceSet || distance > bestDistanceSet.metrics.distance)) {
        bestDistanceSet = set;
      }

      // Duration-only exercises (no distance): longest hold, independent metric
      if (distance == null && duration != null) {
        if (!bestDurationOnlySet || duration > bestDurationOnlySet.metrics.duration) {
          bestDurationOnlySet = set;
        }
      }

      // Pace: fastest ever, independent of distance
      const pace = estimatePace(distance, duration);
      if (pace != null && pace < bestPace) {
        bestPace = pace;
        bestPaceSet = set;
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

    if (bestDistanceSet && bestDistanceSet.metrics.distance > (bestValues.distance ?? -Infinity)) {
      bestValues.distance = bestDistanceSet.metrics.distance;
      bestDistanceSet.personalRecords.distance = true;
    }

    if (bestDurationOnlySet && bestDurationOnlySet.metrics.duration > (bestValues.duration ?? -Infinity)) {
      bestValues.duration = bestDurationOnlySet.metrics.duration;
      bestDurationOnlySet.personalRecords.duration = true;
    }

    if (bestPaceSet && bestPace < (bestValues.pace ?? Infinity)) {
      bestValues.pace = bestPace;
      bestPaceSet.personalRecords.pace = true;
    }
  });

  return sortedHistory.reverse();
}