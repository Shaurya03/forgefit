// Epley formula: estimates the max weight you could lift for 1 rep,
// based on a set performed at a given weight and rep count.
// Only meaningful for weight+reps sets (not cardio/duration-only exercises).
export function estimateOneRepMax(weight, reps) {
  if (weight == null || reps == null) {
    return null;
  }

  return weight * (1 + reps / 30);
}