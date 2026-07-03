const express = require('express');
const { getUsers, getUserById, postUsers, updateUser, deleteUser } = require('../controllers/useController');
const { userSchema, updateUserSchema, userIDParamSchema } = require('../schemas/userSchema');
const { payloadValidation } = require('../middleware/payloadValidation');
const { userIDValidation } = require('../middleware/userIDValidation');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/get', authMiddleware, getUsers);
router.get('/get/:id', authMiddleware, userIDValidation(userIDParamSchema), getUserById);
router.post('/add',  payloadValidation(userSchema), postUsers);
router.put('/update/:id', authMiddleware, userIDValidation(userIDParamSchema), payloadValidation(updateUserSchema), updateUser);
router.delete('/delete/:id', authMiddleware, userIDValidation(userIDParamSchema), deleteUser);

module.exports = { router };