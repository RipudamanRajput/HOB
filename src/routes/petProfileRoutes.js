const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { userIDValidation, IDValidation } = require('../middleware/userIDValidation');
const { userIDParamSchema } = require('../schemas/userSchema');
const { getPetProfileByIdController, postPetProfileController, getPetProfileController, updatePetProfileController } = require('../controllers/petProfileController');
const { payloadValidation } = require('../middleware/payloadValidation');
const { updatePetProfileSchema, createPetProfileSchema } = require('../schemas/petProfileSchema');

const petProfileRoutes = express.Router();
petProfileRoutes.get('/get/:id', authMiddleware, IDValidation(userIDParamSchema), userIDValidation(userIDParamSchema), getPetProfileByIdController);
petProfileRoutes.post('/add', authMiddleware, userIDValidation(userIDParamSchema), payloadValidation(createPetProfileSchema), postPetProfileController);
petProfileRoutes.get('/get', authMiddleware, userIDValidation(userIDParamSchema), getPetProfileController);
petProfileRoutes.put('/update/:petProfileId', authMiddleware, userIDValidation(userIDParamSchema), payloadValidation(updatePetProfileSchema), updatePetProfileController);

module.exports = { petProfileRoutes };