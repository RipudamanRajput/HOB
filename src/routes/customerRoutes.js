const express = require('express');
const { payloadValidation } = require('../middleware/payloadValidation');
const { userIDValidation, IDValidation } = require('../middleware/userIDValidation');
const authMiddleware = require('../middleware/authMiddleware');
const { createCustomerSchema } = require('../schemas/customerSchema');
const { userIDParamSchema } = require('../schemas/userSchema');
const { getCustomerById, addCustomer, getCustomers } = require('../controllers/customerController');

const customerRouter = express.Router();
customerRouter.get('/get/:id', authMiddleware, IDValidation(userIDParamSchema), userIDValidation(userIDParamSchema), getCustomerById);
customerRouter.post('/add',authMiddleware, userIDValidation(userIDParamSchema), payloadValidation(createCustomerSchema), addCustomer);
customerRouter.get('/get', userIDValidation(userIDParamSchema), authMiddleware, getCustomers);

module.exports = { customerRouter };