const { Op } = require('sequelize');
const { Booking: getBookingModel } = require('../models/bookingModel');
const { PetProfile: getPetProfileModel } = require('../models/petProfileModel');
const { getPaymentModel } = require('../models/paymentModel');

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
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
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

const cancelBookingService = async (cancellationData) => {
    const Booking = getBookingModel();
    const booking = await Booking.findByPk(cancellationData.bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }
    if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
    }
    const updatedBooking = await Booking.update({
        status: 'cancelled',
        cancellationBy: cancellationData.cancellationBy,
        cancellationReason: cancellationData.cancellationReason,
        cancellationDate: cancellationData.cancellationDate
    }, {
        where: { id: cancellationData.bookingId }
    });
    return updatedBooking;
};

// ************ for admin use only ************
const getAllBookingService = async (
    page = 1,
    limit = 10,
    userId = '',
    status = '') => {
    const Booking = getBookingModel();
    const PetProfile = getPetProfileModel();
    const Payment = getPaymentModel();
    // console.log(Object.keys(Booking.associations)); 
    // console.log(Object.keys(Payment.associations));

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
        include: [
            {
                association: Booking.associations.customer,
                attributes: [
                    "name"
                ]
            },
            {
                association: Booking.associations.host,
                attributes: [
                    "propertyName"
                ]
            }
        ],
        limit,
        attributes: [
            "id",
            "checkIn",
            "checkOut",
            "status",
            "petIds",
        ],
        offset,
        distinct: true
    });

    const data = await Promise.all(
        rows.map(async (booking) => {
            const bookingData = booking.toJSON();
            let pets = [];
            if (Array.isArray(bookingData.petIds) && bookingData.petIds.length) {
                pets = await PetProfile.findAll({
                    where: { id: { [Op.in]: bookingData.petIds } },
                    attributes: ['id', 'petName', 'name']
                });
            }
            const amount = await Payment.findOne({
                where: { bookingId: bookingData.id },
                attributes: ['amount']
            });

            return {
                ...bookingData,
                pets: pets.map(p => ({ name: p.petName || p.name })),
                petIds: undefined,
                amount: amount?.amount || null
            };
        })
    );

    return {
        data: data,
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit)
    };
}

module.exports = {
    addBookingService,
    getBookingService,
    getBookingByIdService,
    updateBookingStatusByTimeService,
    cancelBookingService,
    getAllBookingService
}