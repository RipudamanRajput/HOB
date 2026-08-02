const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { IDValidation } = require('../middleware/userIDValidation');
const { userIDParamSchema } = require('../schemas/userSchema');
const { getHostById, getHosts, postHosts, getHostsforAdmin, putHosts } = require('../controllers/hostController');
const { payloadValidation } = require('../middleware/payloadValidation');
const { createHostSchema, updateHostSchema } = require('../schemas/hostSchema');
const { upload } = require('../middleware/upload');
const uploadHostfiles = require('../middleware/uploadFiles');
const { checkForHost } = require('../middleware/checkForHost');

const hostRoutes = express.Router();

hostRoutes.get('/get/:id', authMiddleware, IDValidation(userIDParamSchema), getHostById);
hostRoutes.post('/add',
    authMiddleware,
    upload.fields([
        { name: "noc", maxCount: 2 },
        { name: "propertyPhotos", maxCount: 6 },
        { name: "idProof", maxCount: 2 },
        { name: "addressProof", maxCount: 2 },
        { name: "businessProof", maxCount: 2 }
    ]),
    checkForHost,
    uploadHostfiles,
    payloadValidation(createHostSchema),
    postHosts);
hostRoutes.get('/get', getHosts);

// for Admin use Only
hostRoutes.get('/admin/get', authMiddleware, getHostsforAdmin);
hostRoutes.put('/admin/put/:id', authMiddleware, IDValidation(userIDParamSchema), payloadValidation(updateHostSchema), putHosts);

module.exports = { hostRoutes };