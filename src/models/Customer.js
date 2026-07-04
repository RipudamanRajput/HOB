const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');
const { User: getUser } = require('./User');
const { behavioralIssues, PetTypes } = require('../config/pets');

let Customer = null;

const initializeCustomer = () => {
    const sequelize = getSequelize();
    const User = getUser();

    Customer = sequelize.define('Customer', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            unique: true,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        contactNumber: {
            type: DataTypes.STRING,
            unique: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        petProfile: {
            type: DataTypes.STRING
        },
        petType: {
            type: DataTypes.ENUM(...PetTypes),
            allowNull: false
        },
        petName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        petAge: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        petGender: {
            type: DataTypes.ENUM('Male', 'Female'),
            allowNull: false
        },
        petSize: {
            type: DataTypes.ENUM('Small', 'Medium', 'Large'),
            allowNull: false
        },
        vacinationdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        tickTreatmentStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        tickTreatmentDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        healthIssues: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        healthIssuesDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        medicalHistory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        medicalHistoryDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        behavioralIssues: {
            type: DataTypes.ENUM(...behavioralIssues),
            allowNull: false
        },
        behavioralIssuesDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
    Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasOne(Customer, { foreignKey: 'userId', as: 'customer' });
    return Customer;
};

const getCustomer = () => {
    if (!Customer) {
        return initializeCustomer();
    }
    return Customer;
};

module.exports = { Customer: getCustomer, initializeCustomer };