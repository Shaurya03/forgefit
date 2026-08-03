import { isSameDay } from "date-fns";
import { getTopSet } from "./getTopSet";

export function getInitialSet({
  exercise,
  exerciseHistory,
  workoutId,
  workoutDate
}) {

  if (!exerciseHistory?.length) {
    return null;
  }

  const isSameExercise = (exerciseData) =>
    String(
      exerciseData.exerciseId?._id ??
      exerciseData.exerciseId
    ) === String(exercise._id);

  // =========================================================
  // Opening from Exercise page (no workout selected)
  // =========================================================

  if (!workoutId) {

    // Has this exercise already been performed today?
    const todayWorkout =
      exerciseHistory.find(workout =>
        isSameDay(
          new Date(workout.date),
          new Date()
        )
      );

    const todayExercise =
      todayWorkout?.exercises.find(isSameExercise);

    // Continue today's workout -> last set
    if (todayExercise?.sets?.length) {
      return todayExercise.sets.at(-1);
    }

    // Otherwise use the previous workout's top set
    const previousExercise =
      exerciseHistory
        .filter(workout =>
          !isSameDay(
            new Date(workout.date),
            new Date()
          )
        )
        .find(workout =>
          workout.exercises.some(isSameExercise)
        )
        ?.exercises.find(isSameExercise);

    return previousExercise
      ? getTopSet(
        previousExercise.sets,
        exercise.metrics
      )
      : null;
  }

  // =========================================================
  // Opening from a Workout
  // =========================================================

  const currentWorkout =
    exerciseHistory.find(workout =>
      isSameDay(
        new Date(workout.date),
        new Date(workoutDate)
      )
    );

  const currentExercise =
    currentWorkout?.exercises.find(isSameExercise);

  // Exercise already exists in this workout
  if (currentExercise?.sets?.length) {
    return currentExercise.sets.at(-1);
  }

  // Adding a new exercise to today's workout or to a past workout
  const previousExercise =
    exerciseHistory
      .filter(workout =>
        !isSameDay(
          new Date(workout.date),
          new Date()
        )
      )
      .find(workout =>
        workout.exercises.some(isSameExercise)
      )
      ?.exercises.find(isSameExercise);

  return previousExercise
    ? getTopSet(
      previousExercise.sets,
      exercise.metrics
    )
    : null;
}