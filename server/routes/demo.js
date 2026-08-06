const express = require("express");
const requireDemoSecret = require("../middleware/requireDemoSecret");
const { resetDemo } = require("../controllers/demoController");

const router = express.Router();

router.post("/reset", requireDemoSecret, resetDemo);

module.exports = router;