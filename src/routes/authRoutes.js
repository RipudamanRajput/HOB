const express = require('express');
const passport = require('passport');
const { googleCallback, logout } = require('../controllers/authController');

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login-failed' }),
  googleCallback
);

router.get('/logout', logout);

module.exports = router;