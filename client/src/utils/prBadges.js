// Decides whether a set earns the front-of-set "whole set PR" trophy,
// vs. individual metrics earning their own inline star.
// A set gets the front trophy only when its metrics form a combo we've
// defined a combined formula for (weight+reps -> e1RM, distance+duration -> pace).
// Everything else is judged as its own independent metric.

export function isCardioSet(set) {
  const { distance, duration } = set.metrics;
  return distance != null && duration != null;
}

export function isStrengthSet(set) {
  const { weight, reps } = set.metrics;
  return weight != null && reps != null;
}

export function isSetPersonalRecord(set) {
  const strength = isStrengthSet(set) && Boolean(set.personalRecords?.e1rm);

  const cardio =
    isCardioSet(set) &&
    (Boolean(set.personalRecords?.distance) || Boolean(set.personalRecords?.duration));

  return strength || cardio;
}

export function isStarMetric(set, key) {
  if (key === "weight") return true;
  if (key === "reps") return true;
  if (key === "laps") return true;
  if (key === "distance") return !isCardioSet(set);
  if (key === "duration") return !isCardioSet(set);
  return false;
}