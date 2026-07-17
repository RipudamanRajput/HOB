const { getBookingService, getBookingByIdService, addBookingService } = require("../services/bookingService");
const { getHostByUserIDService } = require("../services/hostService");
const { getPetProfileByIdService } = require("../services/petProfileService");


const getBookingController = async (req, res) => {
    try {
        const { page, limit, userId, status } = req.query;
        const bookings = await getBookingService(page, limit, userId, status);
        res.json(bookings);
    } catch (error) {
        console.error('Error in booking controller:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getBookingByIdController = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await getBookingByIdService(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'booking not found' });
        }
        res.json(booking);
    } catch (error) {
        console.error('Error in getBookingById Controller:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const postBookingController = async (req, res) => {
    const { userId } = req.params;
    req.body.userId = userId;
    const petProfileId = req.body.petId;
    const hostId = req.body.hostId;
    try {
        const petProfile = await getPetProfileByIdService(petProfileId)
        if (!petProfile) {
            return res.status(400).json({
                success: false,
                message: "pet profile not found"
            })
        }
        const host = await getHostByUserIDService(hostId)
        if (!host) {
            return res.status(400).json({
                success: false,
                message: "host not found"
            })
        }
        const BookingId = await addBookingService(req.body);
        res.status(201).json({
            message: 'Booking created successfully',
            success: true,
            BookingId: BookingId
        });
    } catch (error) {
        console.error('Error in postBooking controller:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};

module.exports = { getBookingController, getBookingByIdController, postBookingController }