
const { Op, Sequelize } = require('sequelize');
const { Host: getHost } = require('../models/Host');


const addHostService = async (hostData) => {
    const Host = getHost();
    const host = await Host.create(hostData);
    return host.id;
}

const getHostsService = async (
    page = 1,
    limit = 10,
    name = '',
    email = '',
    address = '',
    nameOfBusiness = '',
    boardingOfPets = '',
    amenities = [],
) => {
    const Host = getHost();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
        where.address = { [Op.like]: `%${address}%` };
    }
    if (nameOfBusiness) {
        where.nameOfBusiness = { [Op.like]: `%${nameOfBusiness}%` };
    }
    if (boardingOfPets) {
        where.boardingOfPets = { [Op.like]: `%${boardingOfPets}%` };
    }

    if (typeof amenities === "string") {
        amenities = JSON.parse(amenities);
    }

    if (amenities?.length) {
        where[Op.or] = [];

        for (const amenity of amenities) {
            where[Op.or].push(
                Sequelize.literal(
                    `JSON_CONTAINS(amenities, '"${amenity}"')`
                )
            );

            where[Op.or].push(
                Sequelize.literal(
                    `JSON_SEARCH(paidAmenities, 'one', '${amenity}', NULL, '$[*].amenitie') IS NOT NULL`
                )
            );
        }
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

const getHostByUserIDService = async (userId) => {
    const Host = getHost();
    const host = await Host.findOne({
        where: {
            userId: userId
        }
    });

    return host;
};

module.exports = { addHostService, getHostsService, getHostByIdService, getHostByUserIDService };