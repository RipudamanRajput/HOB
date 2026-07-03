const dotenv = require('dotenv');
const app = require('./src/app');
const { initializePool, getSequelize } = require('./src/config/db');
const { initializeUser } = require('./src/models/User');
const { initializePassport } = require('./src/config/passport');
const { tableInitializer } = require('./src/utils/tableInitializer');

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database connection first
        console.log('Initializing database connection...');
        await initializePool();
        console.log('✓ Database connection established');

        // Initialize User model
        console.log('Initializing models...');
        tableInitializer();
        console.log('✓ Models initialized');

        // Initialize Passport strategies
        console.log('Initializing Passport strategies...');
        initializePassport();
        console.log('✓ Passport initialized');

        // Sync Sequelize models with database
        console.log('Syncing models with database...');
        const sequelize = getSequelize();

        await sequelize.sync({
            force: false,  // Never force in production!
            alter: process.env.NODE_ENV === 'development'  // Only alter in development
        });
        console.log('✓ Database models synced');

        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    process.exit(0);
});


startServer();