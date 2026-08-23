const express = require('express');
const passport = require('passport');
const { googleCallback, logout, loginController } = require('../controllers/authController');

const authRoutes = express.Router();

// Google OAuth routes
// authRoutes.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );
authRoutes.get('/google', (req, res, next) => {
    const redirectUrl = req.query.redirectUrl;

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: encodeURIComponent(redirectUrl)
    })(req, res, next);
});

authRoutes.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login-failed' }),
  googleCallback
);

authRoutes.post('/login', loginController)


module.exports = authRoutes;