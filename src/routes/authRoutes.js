const express = require('express');
const passport = require('passport');
const { googleCallback, logout } = require('../controllers/authController');

const authRoutes = express.Router();

// Google OAuth routes
authRoutes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRoutes.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login-failed' }),
  googleCallback
);


module.exports = authRoutes;