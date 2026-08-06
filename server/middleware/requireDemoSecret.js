const requireDemoSecret = (req, res, next) => {
  const secret = req.headers["x-demo-secret"];

  if (!secret || secret !== process.env.DEMO_RESET_SECRET) {
    return res.status(401).json({ error: "Not authorized" });
  }

  next();
};

module.exports = requireDemoSecret;