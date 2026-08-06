require("dotenv").config();
const mongoose = require("mongoose");
const seedDemoAccount = require("../utils/seedDemoAccount");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await seedDemoAccount();
    console.log("Demo account seeded:", result);
  } catch (error) {
    console.error("Failed to seed demo account:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();