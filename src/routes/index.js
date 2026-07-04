const express = require('express');
const authRoutes = require('./authRoutes');
const { userRouter } = require('./useRoutes');
const { customerRouter } = require('./customerRoutes');
const { hostRoutes } = require('./hostRoutes');

const Router = express.Router();

Router.use('/auth', authRoutes);
Router.use('/users', userRouter);
Router.use('/customers', customerRouter);
Router.use('/host', hostRoutes);

module.exports = Router;