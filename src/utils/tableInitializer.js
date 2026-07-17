const { initializeBooking } = require('../models/bookingModel');
const { initializeCustomer } = require('../models/Customer');
const { initializeHost } = require('../models/Host');
const { initializePetProfileModel } = require('../models/petProfileModel');
const { initializeUser } = require('../models/User');

function tableInitializer() {
    initializeUser();
    initializeCustomer();
    initializeHost();
    initializePetProfileModel();
    initializeBooking();
}

module.exports = { tableInitializer };