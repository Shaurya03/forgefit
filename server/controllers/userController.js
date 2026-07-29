const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const { AUTH_PROVIDERS } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Category = require("../models/categoryModel");
const Exercise = require("../models/exerciseModel");
const Settings = require("../models/settingsModel");
const DEFAULT_CATEGORIES = require("../utils/defaultCategories");
const DEFAULT_EXERCISES = require("../utils/defaultExercises");
const CATEGORY_COLORS = require("../utils/categoryColors");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const createToken = (_id) => {
  return jwt.sign(
    { _id },
    process.env.SECRET,
    { expiresIn: "30d" }
  );
};

const initializeNewUser = async (user) => {

  await Settings.create({
    user_id: user._id
  });

  const categories = await Category.insertMany(
    DEFAULT_CATEGORIES.map(
      (category, index) => ({
        ...category,
        color: CATEGORY_COLORS[index],
        user_id: user._id
      })
    )
  );

  const categoryMap = {};

  categories.forEach(category => {
    categoryMap[category.name] = category;
  });

  await Exercise.insertMany(
    DEFAULT_EXERCISES.map(
      exercise => ({
        name: exercise.name,
        categoryId:
          categoryMap[
            exercise.category
          ]._id,
        metrics:
          categoryMap[
            exercise.category
          ].defaultMetrics,
        user_id: user._id
      })
    )
  );

};

const signupUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.signup(
      email,
      password
    );

    await initializeNewUser(user);

    const token = createToken(user._id);

    res.status(200).json({
      email,
      token
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

};

const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.login(
      email,
      password
    );

    const token = createToken(user._id);

    res.status(200).json({
      email,
      token
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

};

const googleLogin = async (req, res) => {

  try {

    const { credential } = req.body;

    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID
      });

    const payload =
      ticket.getPayload();

    let user =
      await User.findOne({
        googleId: payload.sub
      });

    if (!user) {
      user = await User.findOne({
        email: payload.email
      });
    }

    if (!user) {
      user = await User.createGoogleUser(
        payload.email,
        payload.sub
      );

      await initializeNewUser(user);
    }

    else if (
      user.authProvider ===
      AUTH_PROVIDERS.LOCAL
    ) {

      user.googleId = payload.sub;

      await user.save();

    }

    const token =
      createToken(user._id);

    res.status(200).json({
      email: user.email,
      token
    });

  } catch (error) {

    res.status(400).json({
      error: error.message
    });

  }

};

module.exports = {
  signupUser,
  loginUser,
  googleLogin
};