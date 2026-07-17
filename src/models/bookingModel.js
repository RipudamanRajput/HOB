const { DataTypes } = require("sequelize");
const { getSequelize } = require("../config/db");
const { Customer: getCustomer } = require("./Customer");
const { Host: getHost } = require("./Host");
const { PetProfile: getPetProfileModel } = require("./petProfileModel");
const { bookingType, amenities, bookingStatus } = require("../config/pets");

let Booking = null;

const initializeBooking = () => {
    const sequelize = getSequelize();
    const CustomerModel = getCustomer();
    const HostModel = getHost();
    const PetProfile = getPetProfileModel();

    Booking = sequelize.define("Bookings",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
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
            petId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: PetProfile,
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            status: {
                type: DataTypes.ENUM(...bookingStatus),
                defaultValue: 'initiated',
                allowNull: false

            },
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
                            throw new Error("Check-in date cannot be in the past.");
                        }
                    },
                },
            },
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
                            throw new Error("Check-out date cannot be in the past.");
                        }
                    },
                },
            },
            bookingType: {
                type: DataTypes.ENUM(...bookingType),
                allowNull: false,
            },
            instructions: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            amenities: {
                type: DataTypes.JSON,
                allowNull: true,
                validate: {
                    isValidAmenities(value) {
                        if (value == null) return;
                        if (!Array.isArray(value)) {
                            throw new Error("Amenities must be an array.");
                        }
                        value.forEach((item) => {
                            if (
                                !item ||
                                typeof item !== "object" ||
                                !item.amenity
                            ) {
                                throw new Error("Each amenity must contain amenity and price.");
                            }
                            if (!amenities.includes(item.amenity)) {
                                throw new Error(`Invalid amenity: ${item.amenity}`);
                            }
                            if (
                                typeof item.price !== "number" ||
                                item.price < 0
                            ) {
                                throw new Error(`Price for ${item.amenity} must be a non-negative number.`);
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
            validate: {
                checkDates() {
                    if (this.checkOut <= this.checkIn) {
                        throw new Error("Check-out date must be after check-in date.");
                    }
                },
            },
        }
    );

    Booking.belongsTo(CustomerModel, { foreignKey: "userId", as: "customer" });
    Booking.belongsTo(HostModel, { foreignKey: "hostId", as: "host" });
    Booking.belongsTo(PetProfile, { foreignKey: "petId", as: "pet" });
    CustomerModel.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
    HostModel.hasMany(Booking, { foreignKey: "hostId", as: "bookings" });
    PetProfile.hasMany(Booking, { foreignKey: "petId", as: "bookings" });
    return Booking;
};

const getBookingModel = () => {
    if (!Booking) {
        return initializeBooking();
    }
    return Booking;
};

module.exports = { Booking: getBookingModel, initializeBooking };