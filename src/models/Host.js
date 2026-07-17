const { DataTypes } = require("sequelize");
const { getSequelize } = require("../config/db")
const { User: getUser } = require('./User');
const { PetTypes, amenities, hostStatus } = require("../config/pets");

let Host = null;

const initializeHost = () => {
    const sequelize = getSequelize();
    const User = getUser();

    Host = sequelize.define('Host', {
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
        status: {
            type: DataTypes.ENUM(...hostStatus),
            defaultValue: 'unverified',
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        bussinessType: {
            type: DataTypes.ENUM('Homestyle', 'Professional'),
            allowNull: false
        },
        property: {
            type: DataTypes.ENUM('Owned', 'Rented'),
            allowNull: false
        },
        idProof: {
            type: DataTypes.TEXT,
            validate: {
                isUrl: true,
            },
        },
        addressProof: {
            type: DataTypes.TEXT,
            validate: {
                isUrl: true,
            },
        },
        numberOfCareTakers: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        businessDetails: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nameOfBusiness: {
            type: DataTypes.STRING,
            allowNull: true
        },
        yearsOfExperience: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        boardingOfPets: {
            type: DataTypes.ENUM(...PetTypes),
            allowNull: false,
        },
        boardingType: {
            type: DataTypes.ENUM('Homestyle', 'Professional'),
            allowNull: false,
        },
        capacity: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isValidCapacity(value) {
                    if (!Array.isArray(value)) {
                        throw new Error("Capacity must be an array.");
                    }
                    value.forEach(item => {
                        if (!PetTypes.includes(item.petType)) {
                            throw new Error(`Invalid petType: ${item.petType}`);
                        }

                        if (typeof item.capacity !== "number") {
                            throw new Error("capacity must be a number");
                        }
                    });
                }
            }
        },
        numberOfRooms: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isValidNumberOfRooms(value) {
                    if (!value || typeof value !== "object" || Array.isArray(value)) {
                        throw new Error("numberOfRooms must be an object.");
                    }

                    for (const [petType, data] of Object.entries(value)) {
                        if (!PetTypes.includes(petType)) {
                            throw new Error(`Invalid pet type: ${petType}`);
                        }

                        if (!data || typeof data !== "object") {
                            throw new Error(`Value for ${petType} must be an object.`);
                        }

                        if (
                            typeof data.room !== "number" ||
                            !Number.isInteger(data.room) ||
                            data.room < 0
                        ) {
                            throw new Error(`${petType}.room must be a non-negative integer.`);
                        }

                        if (
                            typeof data.cage !== "number" ||
                            !Number.isInteger(data.cage) ||
                            data.cage < 0
                        ) {
                            throw new Error(`${petType}.cage must be a non-negative integer.`);
                        }
                    }
                }
            }
        },
        pricePerPet: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isValidAmenities(value) {
                    if (!Array.isArray(value)) {
                        throw new Error("Amenities must be an array.");
                    }
                    value.forEach(item => {
                        if (!PetTypes.includes(item.petType)) {
                            throw new Error(`Invalid petType: ${item.petType}`);
                        }

                        if (typeof item.price !== "number") {
                            throw new Error("price must be a number");
                        }
                    });
                }
            }
        },
        sizeOfRooms: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isValidSizeOfRooms(value) {
                    if (!value || typeof value !== "object" || Array.isArray(value)) {
                        throw new Error("sizeOfRooms must be an object.");
                    }

                    const validateDimension = (dimension, name) => {
                        if (!dimension || typeof dimension !== "object") {
                            throw new Error(`${name} must be an object.`);
                        }

                        ["length", "breadth", "height"].forEach(key => {
                            if (
                                typeof dimension[key] !== "number" ||
                                dimension[key] <= 0
                            ) {
                                throw new Error(`${name}.${key} must be a positive number.`);
                            }
                        });
                    };

                    for (const [petType, data] of Object.entries(value)) {
                        if (!PetTypes.includes(petType)) {
                            throw new Error(`Invalid pet type: ${petType}`);
                        }

                        validateDimension(data.room, `${petType}.room`);
                        validateDimension(data.cage, `${petType}.cage`);
                    }
                }
            }
        },
        limitationsForGuests: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        limitationsDescription: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        propertyAreaType: {
            type: DataTypes.ENUM('Square Feet', 'Square Meters'),
            allowNull: false
        },
        propertyAreaSize: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        amenities: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        paidAmenities: {
            type: DataTypes.JSON,
            allowNull: true,
            validate: {
                isValidCapacity(value) {
                    if (!Array.isArray(value)) {
                        throw new Error("Capacity must be an array.");
                    }
                    value.forEach(item => {
                        if (!amenities.includes(item.amenitie)) {
                            throw new Error(`Invalid amenity: ${item.amenitie}`);
                        }

                        if (typeof item.price !== "number") {
                            throw new Error("price must be a number");
                        }
                    });
                }
            }
        },
        fareAccordingToPetSize: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        noc: {
            type: DataTypes.TEXT,
            isUrl: true,
            validate: {
                isUrl: true,
            }
        },
        businessProf: {
            type: DataTypes.TEXT,
            isUrl: true,
            validate: {
                isUrl: true,
            }
        },
        rule: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
    Host.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    User.hasOne(Host, { foreignKey: 'userId', as: 'host' });
    return Host;
};

const getHost = () => {
    if (!Host) {
        return initializeHost();
    }
    return Host;
};

module.exports = { Host: getHost, initializeHost };