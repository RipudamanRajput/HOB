const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { IDValidation } = require('../middleware/userIDValidation');
const { userIDParamSchema } = require('../schemas/userSchema');
const { getHostById, getHosts, postHosts, getHostsforAdmin, putHosts, putHostProperty, updateHostHolidayStatusService } = require('../controllers/hostController');
const { payloadValidation } = require('../middleware/payloadValidation');
const { createHostSchema, adminUpdateHostSchema, updateHostSchema } = require('../schemas/hostSchema');
const { upload } = require('../middleware/upload');
const { uploadHostfiles, handleHostUpload, updateHostFiles } = require('../middleware/uploadFiles');
const { checkForHost } = require('../middleware/checkForHost');
const { getHostHolidayByIdController, getHostHolidayController, postHostHolidayController } = require('../controllers/hostHolidayController');
const { createHostHolidaySchema } = require('../schemas/hostHolidaySchema');

const hostRoutes = express.Router();

hostRoutes.get('/get/:id', IDValidation(userIDParamSchema), getHostById);
hostRoutes.post('/add',
    authMiddleware,
    handleHostUpload,
    checkForHost,
    payloadValidation(createHostSchema),
    uploadHostfiles,
    postHosts);
hostRoutes.get('/get', getHosts);
hostRoutes.put('/put/:id',
    authMiddleware,
    updateHostFiles,
    IDValidation(userIDParamSchema),
    payloadValidation(updateHostSchema),
    uploadHostfiles,
    putHostProperty);

// for Hsot Holiday (Admin and Host)
hostRoutes.get('/holiday/get', authMiddleware, getHostHolidayController);
hostRoutes.get('/holiday/get/:id', authMiddleware, getHostHolidayByIdController);
hostRoutes.post('/holiday/add', authMiddleware, payloadValidation(createHostHolidaySchema), postHostHolidayController);

// host Holiday status update by CRON
hostRoutes.get('/holiday/update/status-job', authMiddleware, updateHostHolidayStatusService);

// for Admin use Only
hostRoutes.get('/admin/get', authMiddleware, getHostsforAdmin);
hostRoutes.put('/admin/put/:id', authMiddleware, IDValidation(userIDParamSchema), payloadValidation(adminUpdateHostSchema), putHosts);

module.exports = { hostRoutes };