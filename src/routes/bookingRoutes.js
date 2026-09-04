const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { userIDValidation, IDValidation } = require('../middleware/userIDValidation');
const { userIDParamSchema } = require('../schemas/userSchema');
const { payloadValidation } = require('../middleware/payloadValidation');
const { createBookingSchema } = require('../schemas/bookingSchema');
const { getBookingByIdController, postBookingController, getBookingController, updateBookingStatusController } = require('../controllers/bookingController');

const bookingRoutes = express.Router();
bookingRoutes.get('/get/:id', authMiddleware, IDValidation(userIDParamSchema), userIDValidation(userIDParamSchema), getBookingByIdController);
bookingRoutes.post('/add', authMiddleware, userIDValidation(userIDParamSchema), payloadValidation(createBookingSchema), postBookingController);
bookingRoutes.get('/get', authMiddleware, userIDValidation(userIDParamSchema), getBookingController);

// to update the status of booking by CRON
bookingRoutes.get('/update/status-job', updateBookingStatusController);

module.exports = { bookingRoutes };