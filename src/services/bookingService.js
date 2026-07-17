const { Op } = require('sequelize');
const { Booking: getBookingModel } = require('../models/bookingModel');


const addBookingService = async (bookingData) => {
    const Booking = getBookingModel();
    const booking = await Booking.create(bookingData);
    return booking.id;
}

const getBookingService = async (
    page = 1,
    limit = 10,
    userId = '',
    status = '') => {
    const Booking = getBookingModel();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (userId) {
        where.userId = { [Op.like]: `%${userId}%` };
    }
    if (status) {
        where.status = { [Op.like]: `%${status}%` };
    }
    const { count, rows } = await Booking.findAndCountAll({
        where,
        limit,
        offset
    });

    return {
        data: rows,
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit)
    };
}

const getBookingByIdService = async (BookingId) => {
    const Booking = getBookingModel();
    const booking = await Booking.findByPk(BookingId);
    return booking;
}

module.exports = { addBookingService, getBookingService, getBookingByIdService }