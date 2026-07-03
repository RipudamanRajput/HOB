const app = require('../src/app');
const { initializePool, getSequelize } = require('../src/config/db');
const { initializePassport } = require('../src/config/passport');
const { initializeUser } = require('../src/models/User');
const { tableInitializer } = require('../src/utils/tableInitializer');

let initialized = false;

module.exports = async (req, res) => {
    try {
        // Initialize only once
        if (!initialized) {
            console.log('🔄 Initializing database and models...');

            await initializePool();
            console.log('✓ Database connection established');

            tableInitializer();
            console.log('✓ Models initialized');

            initializePassport();
            console.log('✓ Passport initialized');

            // Sync database (won't drop tables if force: false)
            const sequelize = getSequelize();
            await sequelize.sync({ alter: false, force: false });
            console.log('✓ Database synced');

            initialized = true;
        }

        // Handle the request through Express
        return app(req, res);
    } catch (error) {
        console.error('❌ API Error:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
};
