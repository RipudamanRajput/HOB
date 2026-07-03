const { DataTypes } = require('sequelize');
const { getSequelize } = require('../config/db');
const { prettifyError } = require('zod/v4/core');

let Customer = null;
let PetTypes = [
    "Dog",
    "Cat",
    "Bird",
    "Rabbit",
    "Hamster"
];
let behavioralIssues = [
    "No",
    "Yes",
    "Aggression",
    "Anxiety",
    "Resource Gaurding",
    "Food Agression",
    "Fear",
    "Other"
];


const initializeCustomer = () => {
    const sequelize = getSequelize();

    Customer = sequelize.define('Customer', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        googleId: {
            type: DataTypes.STRING,
            unique: true
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            unique: false
        },
        contactNo: {
            type: DataTypes.STRING,
            unique: false
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
        petsize: {
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

    return Customer;
};

const getCustomer = () => {
    if (!Customer) {
        return initializeCustomer();
    }
    return Customer;
};

module.exports = { Customer: getCustomer, initializeCustomer };