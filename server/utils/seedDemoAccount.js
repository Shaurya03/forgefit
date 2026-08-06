const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Settings = require("../models/settingsModel");
const Category = require("../models/categoryModel");
const Exercise = require("../models/exerciseModel");
const Workout = require("../models/workoutModel");
const DEFAULT_CATEGORIES = require("./defaultCategories");
const DEFAULT_EXERCISES = require("./defaultExercises");
const CATEGORY_COLORS = require("./categoryColors");
const buildDemoWorkouts = require("./demoSeedData");

const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@forgefit.app";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "ForgeFitDemo123!";

async function seedDemoAccount() {
  let user = await User.findOne({ email: DEMO_EMAIL });

  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(DEMO_PASSWORD, salt);

    user = await User.create({
      email: DEMO_EMAIL,
      password: hash,
      isDemo: true
    });
  } else if (!user.isDemo) {
    // Safety net: never let this touch a real account that happens
    // to share the demo email.
    throw new Error(
      `Refusing to reset ${DEMO_EMAIL} — existing account is not marked isDemo`
    );
  }

  const userId = user._id;

  await Promise.all([
    Settings.deleteMany({ user_id: userId }),
    Category.deleteMany({ user_id: userId }),
    Exercise.deleteMany({ user_id: userId }),
    Workout.deleteMany({ user_id: userId })
  ]);

  await Settings.create({ user_id: userId });

  const categories = await Category.insertMany(
    DEFAULT_CATEGORIES.map((category, index) => ({
      ...category,
      color: CATEGORY_COLORS[index],
      user_id: userId
    }))
  );

  const categoryIds = {};
  categories.forEach(c => { categoryIds[c.name] = c._id; });

  const exercises = await Exercise.insertMany(
    DEFAULT_EXERCISES.map(exercise => ({
      name: exercise.name,
      categoryId: categoryIds[exercise.category],
      metrics: DEFAULT_CATEGORIES.find(
        c => c.name === exercise.category
      ).defaultMetrics,
      user_id: userId
    }))
  );

  const exerciseIds = {};
  exercises.forEach(e => { exerciseIds[e.name] = e._id; });

  const workouts = buildDemoWorkouts(exerciseIds, categoryIds).map(
    workout => ({ ...workout, user_id: userId })
  );

  await Workout.insertMany(workouts);

  return { email: DEMO_EMAIL, workoutsSeeded: workouts.length };
}

module.exports = seedDemoAccount;