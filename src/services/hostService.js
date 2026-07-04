
const { Op } = require('sequelize');
const { Host: getHost } = require('../models/Host');


const addHostService = async (hostData) => {
    const Host = getHost();
    const host = await Host.create(hostData);
    return host.id;
}

const getHostsService = async (page = 1, limit = 10, name = '', email = '') => {
    const Host = getHost();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    const { count, rows } = await Host.findAndCountAll({
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

const getHostByIdService = async (hostId) => {
    const Host = getHost();
    const host = await Host.findByPk(hostId);
    return host;
}

module.exports = { addHostService, getHostsService, getHostByIdService };