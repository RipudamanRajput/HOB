const { Op } = require('sequelize');
const { HostHoliday: getHostHolidayModel } = require('../models/HostHolidayModel');


const addHostHolidayService = async (hostHolidayData) => {
    const HostHoliday = getHostHolidayModel();
    const hostHoliday = await HostHoliday.create(hostHolidayData);
    return hostHoliday.id;
}

const getHostHolidaysService = async (page = 1, limit = 10, hostName = '', fromDate = '', toDate = '', hostId, userId) => {
    const HostHoliday = getHostHolidayModel();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (hostId) {
        where.hostId = { [Op.like]: `%${hostId}%` };
    }
    if (hostName) {
        where.hostName = { [Op.like]: `%${hostName}%` };
    }
    if (fromDate) {
        where.fromDate = { [Op.like]: `%${fromDate}%` };
    }
    if (toDate) {
        where.toDate = { [Op.like]: `%${toDate}%` };
    }
    if (userId) {
        where.hostId = { [Op.like]: `%${userId}%` };
    }
    const { count, rows } = await HostHoliday.findAndCountAll({
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

const getHostHolidaysByHostIdService = async (hostId) => {
    const HostHoliday = getHostHolidayModel();
    const row = await HostHoliday.findByPk(hostId);
    return row;
}


module.exports = { addHostHolidayService, getHostHolidaysService, getHostHolidaysByHostIdService };