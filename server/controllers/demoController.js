const seedDemoAccount = require("../utils/seedDemoAccount");

const resetDemo = async (req, res, next) => {
  try {
    const result = await seedDemoAccount();
    res.status(200).json({ message: "Demo account reset", ...result });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = { resetDemo };