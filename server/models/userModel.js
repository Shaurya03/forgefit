const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const AUTH_PROVIDERS = {
  LOCAL: "local",
  GOOGLE: "google"
};

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL
    },

    googleId: {
      type: String,
      default: null
    },

    isDemo: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.statics.signup = async function (
  email,
  password
) {
  const exists = await this.findOne({ email });

  if (
    exists &&
    exists.authProvider === AUTH_PROVIDERS.GOOGLE
  ) {
    throw new Error(
      "An account with this email already exists. Please continue with Google."
    );
  }

  if (exists) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(
    password,
    salt
  );

  return this.create({
    email,
    password: hash,
    authProvider: AUTH_PROVIDERS.LOCAL
  });
};

userSchema.statics.createGoogleUser = async function (
  email,
  googleId
) {

  const salt = await bcrypt.genSalt(10);

  const randomPassword = await bcrypt.hash(
    crypto.randomUUID(),
    salt
  );

  return this.create({
    email,
    password: randomPassword,
    authProvider: AUTH_PROVIDERS.GOOGLE,
    googleId
  });
};

userSchema.statics.login = async function (
  email,
  password
) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Invalid email");
  }

  if (
    user.authProvider ===
    AUTH_PROVIDERS.GOOGLE
  ) {
    throw new Error(
      "This account uses Google Sign-In."
    );
  }

  const match = await bcrypt.compare(
    password,
    user.password
  );

  if (!match) {
    throw new Error("Invalid password");
  }

  return user;
};

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;
module.exports.AUTH_PROVIDERS =
  AUTH_PROVIDERS;