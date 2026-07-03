const { initializeCustomer } = require('../models/Customer');
const { initializeUser } = require('../models/User');

function tableInitializer() {
    initializeUser();
    initializeCustomer();
}

module.exports = { tableInitializer };