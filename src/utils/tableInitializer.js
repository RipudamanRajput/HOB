const { initializeBooking } = require('../models/bookingModel');
const { initializeCustomer } = require('../models/Customer');
const { initializeHost } = require('../models/Host');
const { initializeHostHolidayModel } = require('../models/HostHolidayModel');
const { initializePaymentModel } = require('../models/paymentModel');
const { initializePetProfileModel } = require('../models/petProfileModel');
const { initializeUser } = require('../models/User');

// this fuction will initialize all the tables in the database
function tableInitializer() {
    initializeUser();
    initializeCustomer();
    initializeHost();
    initializePaymentModel();
    initializePetProfileModel();
    initializeBooking();
    initializeHostHolidayModel();
}

module.exports = { tableInitializer };