const { initializeCustomer } = require('../models/Customer');
const { initializeHost } = require('../models/Host');
const { initializeUser } = require('../models/User');

function tableInitializer() {
    initializeUser();
    initializeCustomer();
    initializeHost();
}

module.exports = { tableInitializer };