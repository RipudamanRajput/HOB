const { getHostHolidaysService, getHostHolidaysByHostIdService, addHostHolidayService } = require("../services/HostHoliday");

const getHostHolidayController = async (req, res) => {
    try {
        const { page, limit, hostName, fromDate, toDate, hostId } = req.query;
        const hostHolidays = await getHostHolidaysService(page, limit, hostName, fromDate, toDate, hostId);
        res.json(hostHolidays);
    } catch (error) {
        console.error('Error in getHostHoliday Controller:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getHostHolidayByIdController = async (req, res) => {
    try {
        const hostHolidayId = req.params.id;
        const hostHoliday = await getHostHolidaysByHostIdService(hostHolidayId);
        if (!hostHoliday) {
            return res.status(404).json({ error: 'Host holiday not found' });
        }
        res.json(hostHoliday);
    } catch (error) {
        console.error('Error in getHostHolidayById Controller:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const postHostHolidayController = async (req, res) => {
    try {
        const hostHolidayId = await addHostHolidayService(req.body);
        res.status(201).json({
            message: 'Host holiday created successfully',
            success: true,
            HostHolidayId: hostHolidayId
        });
    } catch (error) {
        console.error('Error in postHostHoliday Controller:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            success: false,
            message: error.message
        });
    }
};


module.exports = { getHostHolidayController, getHostHolidayByIdController, postHostHolidayController };