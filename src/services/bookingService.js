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

const updateBookingStatusByTimeService = async () => {
    try {
        const Booking = getBookingModel();

        const now = new Date();
        console.log('Booking status cron run at: ' + now);

        // Start of today: 00:00:00
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        // Start of tomorrow: 00:00:00
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

        /**
         * 1. Change today's bookings to RUNNING
         *
         * Conditions:
         * - checkIn is today
         * - checkIn time has arrived
         * - status is not cancelled/completed/running
         */
        const [runningUpdated] = await Booking.update(
            {
                status: 'running'
            },
            {
                where: {
                    checkIn: {
                        [Op.gte]: startOfToday,
                        [Op.lt]: startOfTomorrow,
                        [Op.lte]: now
                    },
                    status: {
                        [Op.notIn]: [
                            'cancelled',
                            'completed',
                            'running'
                        ]
                    }
                }
            }
        );

        /**
         * 2. Change RUNNING bookings to COMPLETED
         *
         * Condition:
         * - status is running
         * - checkout date/time has passed
         */
        const [completedUpdated] = await Booking.update(
            {
                status: 'completed'
            },
            {
                where: {
                    status: 'running',
                    checkOut: {
                        [Op.lte]: now
                    }
                }
            }
        );

        console.log('Booking status cron completed:', {
            runningUpdated,
            completedUpdated,
            currentTime: now
        });


        return {
            runningUpdated,
            completedUpdated
        };

    } catch (error) {
        console.error(
            'Error updating booking statuses:',
            error
        );

        throw error;
    }
};


module.exports = { addBookingService, getBookingService, getBookingByIdService, updateBookingStatusByTimeService }