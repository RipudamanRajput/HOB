
const { DataTypes } = require("sequelize");

const { getSequelize } = require("../config/db");
const { Customer: getCustomer } = require("./Customer");
const { Host: getHost } = require("./Host");
const { bookingType, amenities, bookingStatus } = require("../config/pets");

let Booking = null;

const initializeBooking = () => {
    const sequelize = getSequelize();

    const CustomerModel = getCustomer();
    const HostModel = getHost();

    Booking = sequelize.define(
        "Bookings",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            // Customer who made the booking
            userId: {
                type: DataTypes.UUID,
                allowNull: false,

                references: {
                    model: CustomerModel,
                    key: "userId",
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            // Host being booked
            hostId: {
                type: DataTypes.UUID,
                allowNull: false,

                references: {
                    model: HostModel,
                    key: "userId",
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },

            // Multiple pets in one booking
            petIds: {
                type: DataTypes.JSON,
                allowNull: false,

                validate: {
                    isValidPetIds(value) {
                        if (!Array.isArray(value) || value.length === 0) {
                            throw new Error(
                                "At least one pet is required."
                            );
                        }

                        value.forEach((id) => {
                            if (
                                typeof id !== "string" ||
                                !id.trim()
                            ) {
                                throw new Error(
                                    "Each pet ID must be a valid string."
                                );
                            }
                        });
                    },
                },
            },

            // Booking status
            status: {
                type: DataTypes.ENUM(...bookingStatus),
                defaultValue: "initiated",
                allowNull: false,
            },

            // Check-in date/time
            checkIn: {
                type: DataTypes.DATE,
                allowNull: false,

                validate: {
                    isTodayOrFuture(value) {
                        const inputDate = new Date(value);
                        const today = new Date();

                        inputDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        if (inputDate < today) {
                            throw new Error(
                                "Check-in date cannot be in the past."
                            );
                        }
                    },
                },
            },

            // Check-out date/time
            checkOut: {
                type: DataTypes.DATE,
                allowNull: false,

                validate: {
                    isTodayOrFuture(value) {
                        const inputDate = new Date(value);
                        const today = new Date();

                        inputDate.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);

                        if (inputDate < today) {
                            throw new Error(
                                "Check-out date cannot be in the past."
                            );
                        }
                    },
                },
            },

            // Type of booking
            bookingType: {
                type: DataTypes.ENUM(...bookingType),
                allowNull: false,
            },

            // Cancellation protection
            cancellationProtection: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            // Additional instructions
            instructions: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            // Selected amenities
            amenities: {
                type: DataTypes.JSON,
                allowNull: true,

                validate: {
                    isValidAmenities(value) {
                        if (value == null) return;

                        if (!Array.isArray(value)) {
                            throw new Error(
                                "Amenities must be an array."
                            );
                        }

                        value.forEach((item) => {
                            if (
                                !item ||
                                typeof item !== "object" ||
                                !item.amenity
                            ) {
                                throw new Error(
                                    "Each amenity must contain amenity and price."
                                );
                            }

                            if (!amenities.includes(item.amenity)) {
                                throw new Error(
                                    `Invalid amenity: ${item.amenity}`
                                );
                            }

                            if (
                                typeof item.price !== "number" ||
                                item.price < 0
                            ) {
                                throw new Error(
                                    `Price for ${item.amenity} must be a non-negative number.`
                                );
                            }
                        });
                    },
                },
            },

            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },

        {
            // Model-level validations
            validate: {
                checkDates() {
                    if (this.checkOut <= this.checkIn) {
                        throw new Error(
                            "Check-out date must be after check-in date."
                        );
                    }
                },
            },
        }
    );

    /*
     * Associations
     *
     * NOTE:
     * petIds is JSON, so there is intentionally NO
     * PetProfile association here.
     */

    Booking.belongsTo(CustomerModel, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "customer",
    });

    Booking.belongsTo(HostModel, {
        foreignKey: "hostId",
        targetKey: "userId",
        as: "host",
    });

    CustomerModel.hasMany(Booking, {
        foreignKey: "userId",
        sourceKey: "userId",
        as: "bookings",
    });

    HostModel.hasMany(Booking, {
        foreignKey: "hostId",
        sourceKey: "userId",
        as: "bookings",
    });

    return Booking;
};

const getBookingModel = () => {
    if (!Booking) {
        return initializeBooking();
    }

    return Booking;
};

module.exports = {
    Booking: getBookingModel,
    initializeBooking,
};

