const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { userIDValidation } = require('../middleware/userIDValidation');
const { userIDParamSchema } = require('../schemas/userSchema');
const { getHostById, getHosts, postHosts } = require('../controllers/hostController');
const { payloadValidation } = require('../middleware/payloadValidation');
const { createHostSchema } = require('../schemas/hostSchema');

const hostRoutes = express.Router();
hostRoutes.get('/get/:id', authMiddleware, userIDValidation(userIDParamSchema), getHostById);
hostRoutes.post('/add', authMiddleware, payloadValidation(createHostSchema), postHosts);
hostRoutes.get('/get', authMiddleware, getHosts);

module.exports = { hostRoutes };