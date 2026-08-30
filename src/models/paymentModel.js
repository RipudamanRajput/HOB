const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');

let Payment = null;

const initializePaymentModel = () => {
    const sequelize = getSequelize();

    Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'created'
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    return Payment;
};

const getPaymentModel = () => {
    if (!Payment) {
        return initializePaymentModel();
    }
    return Payment;
};

module.exports = { getPaymentModel, initializePaymentModel };