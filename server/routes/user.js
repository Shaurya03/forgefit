const express = require('express');

const { signupUser, loginUser, googleLogin } = require('../controllers/userController');
const authLimiter = require('../middleware/authLimiter');

const router = express.Router();

router.post('/signup', authLimiter, signupUser);
router.post('/login', authLimiter, loginUser);
router.post("/google", authLimiter, googleLogin);

module.exports = router;