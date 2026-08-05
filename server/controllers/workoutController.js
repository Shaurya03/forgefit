const Workout = require("../models/workoutModel");
const Exercise = require("../models/exerciseModel");

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const validateMetric = (metric, value) => {
  if (typeof value !== "number") {
    throw createError(
      `${metric} must be a number`,
      400
    );
  }

  switch (metric) {
    case "weight":
      if (value < 0) {
        throw createError(
          "Weight cannot be negative",
          400
        );
      }
      break;

    case "rpe":
      if (value < 1 || value > 10) {
        throw createError(
          "RPE must be between 1 and 10",
          400
        );
      }
      break;

    default:
      if (value <= 0) {
        throw createError(
          `${metric} must be greater than 0`,
          400
        );
      }
  }
};

const validateExercises = (exercises) => {

  if (!Array.isArray(exercises)) {
    throw createError(
      "Exercises must be an array",
      400
    );
  }

  if (exercises.length === 0) {
    throw createError(
      "At least one exercise is required",
      400
    );
  }

  for (const exercise of exercises) {

    if (!exercise.exerciseId) {
      throw createError(
        "Exercise is required",
        400
      );
    }

    if (
      !Array.isArray(exercise.sets) ||
      exercise.sets.length === 0
    ) {
      throw createError(
        "At least one set is required",
        400
      );
    }

    for (const set of exercise.sets) {

      if (
        !set.metrics ||
        Object.keys(set.metrics).length === 0
      ) {
        throw createError(
          "Set metrics are required",
          400
        );
      }

      for (const [metric, value] of Object.entries(set.metrics)) {
        validateMetric(metric, value);
      }
    }
  }
};

// GET all workouts
const getWorkouts = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const workouts = await Workout
      .find({ user_id })
      .populate({
        path: "exercises.exerciseId",
        populate: {
          path: "categoryId"
        }
      })
      .sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// GET a single workout
const getWorkout = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user_id = req.user._id;
    const workout = await Workout
      .findOne({
        _id: id,
        user_id
      })
      .populate({
        path: "exercises.exerciseId",
        populate: {
          path: "categoryId"
        }
      });

    if (!workout) {
      throw createError("Workout not found", 404);
    }

    res.status(200).json(workout);

  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// POST a new workout
const createWorkout = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const { title, exercises, date } = req.body;

    validateExercises(exercises);

    const workout = await Workout.create({
      title:
        typeof title === "string"
          ? title.trim()
          : "",
      exercises,
      date: date ?? new Date(),
      user_id
    });

    const populatedWorkout = await Workout
      .findById(workout._id)
      .populate({
        path: "exercises.exerciseId",
        populate: {
          path: "categoryId"
        }
      });

    res.status(201).json(populatedWorkout);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// UPDATE a workout
const updateWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, exercises } = req.body;
    const user_id = req.user._id;

    if (
      title !== undefined &&
      typeof title !== "string"
    ) {
      throw createError(
        "Title must be a string",
        400
      );
    }

    if (exercises !== undefined) {
      validateExercises(exercises);
    }

    const updateFields = {};

    if (typeof title === "string") {
      updateFields.title = title.trim();
    }

    if (exercises !== undefined) {
      updateFields.exercises = exercises;
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: id, user_id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!workout) {
      throw createError(
        "Workout not found",
        404
      );
    }

    const populatedWorkout = await Workout
      .findById(workout._id)
      .populate({
        path: "exercises.exerciseId",
        populate: {
          path: "categoryId"
        }
      });

    res.status(200).json(populatedWorkout);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// DELETE a workout
const deleteWorkout = async (req, res, next) => {
  const user_id = req.user._id;
  const { id } = req.params;

  try {
    const workout = await Workout.findOneAndDelete({ _id: id, user_id });

    if (!workout) {
      throw createError(
        "Workout not found",
        404
      );
    }

    res.status(200).json(workout);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const getExerciseHistory = async (req, res) => {
  const user_id = req.user._id;
  const { id: exerciseId } = req.params;

  const exercise = await Exercise.findOne({
    _id: exerciseId,
    user_id
  });

  if (!exercise) {
    return res.status(404).json({
      error: "Exercise not found"
    });
  }

  const workouts = await Workout
    .find({ user_id })
    .sort({ date: -1 });

  const history = [];

  for (const workout of workouts) {
    for (const loggedExercise of workout.exercises) {

      if (
        loggedExercise.exerciseId.toString() !== exerciseId
      ) {
        continue;
      }

      history.push({
        workoutId: workout._id,
        workoutTitle: workout.title,
        date: workout.date,
        exerciseName: exercise.name,
        metrics: exercise.metrics,
        sets: loggedExercise.sets
      });
    }
  }

  res.status(200).json(history);
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getExerciseHistory
};