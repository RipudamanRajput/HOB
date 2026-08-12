
const { Op, Sequelize } = require('sequelize');
const { Host: getHost } = require('../models/Host');


const addHostService = async (hostData) => {
    const Host = getHost();
    const host = await Host.create(hostData);
    return host.id;
}

const updateHostService = async (req, res) => {
    const Host = getHost();
    const { id } = req.params
    const {
        status,
        accountSuspendReason,
        topRated,
        mostPopullar
    } = req.body;

    const updateData = {};

    if (status !== undefined) {
        updateData.status = status;
    }

    if (accountSuspendReason !== undefined) {
        updateData.accountSuspendReason = accountSuspendReason;
    }

    if (topRated !== undefined) {
        updateData.topRated = topRated;
    }

    if (mostPopullar !== undefined) {
        updateData.mostPopullar = mostPopullar;
    }
    const [updatedRows] = await Host.update(updateData, {
        where: { id }
    });

    return updatedRows;
};

const updateHostPropertyService = async (req, res) => {
    const Host = getHost();
    const { id } = req.params
    const {
        boardingOfPets,
        capacity,
        numberOfRooms,
        sizeOfRooms,
        sizeOfCages,
        pricePerPet,
        Services,
        amenities,
        paidAmenities
    } = req.body;

    const updateData = {};

    if (boardingOfPets !== undefined) {
        updateData.boardingOfPets = boardingOfPets;
    }

    if (capacity !== undefined) {
        updateData.capacity = capacity;
    }

    if (numberOfRooms !== undefined) {
        updateData.numberOfRooms = numberOfRooms;
    }

    if (sizeOfRooms !== undefined) {
        updateData.sizeOfRooms = sizeOfRooms;
    }

    if (sizeOfCages !== undefined) {
        updateData.sizeOfCages = sizeOfCages;
    }

    if (pricePerPet !== undefined) {
        updateData.pricePerPet = pricePerPet;
    }

    if (amenities !== undefined) {
        updateData.amenities = amenities;
    }

    if (paidAmenities !== undefined) {
        updateData.paidAmenities = paidAmenities;
    }

    if (Services !== undefined) {
        updateData.Services = Services;
    }

    const [updatedRows] = await Host.update(updateData, {
        where: { id }
    });

    return updatedRows;
};

const getHostsService = async (
    page = 1,
    limit = 10,
    propertyName = '',
    email = '',
    address = '',
    nameOfBusiness = '',
    boardingOfPets = '',
    amenities = [],
    status = '',
    bussinessType = '',
    minPrice = '',
    maxPrice = ''
) => {
    const Host = getHost();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (propertyName) {
        where.propertyName = { [Op.like]: `%${propertyName}%` };
    }
    if (status) {
        where.status = status;
    } else {
        where.status = "verified";
    }
    if (address) {
        where.address = { [Op.like]: `%${address}%` };
    }
    if (bussinessType) {
        if (typeof bussinessType === "string") {
            try {
                bussinessType = JSON.parse(bussinessType);
            } catch {
                bussinessType = bussinessType.split(",");
            }
        }

        if (Array.isArray(bussinessType) && bussinessType.length) {
            where.bussinessType = {
                [Op.in]: bussinessType
            };
        }
    }

    if (minPrice !== '' || maxPrice !== '') {
        const min = Number(minPrice);
        const max = Number(maxPrice);

        if (Number.isNaN(min) || Number.isNaN(max)) {
            throw new Error('minPrice and maxPrice must be valid numbers');
        }

        where[Op.and] = where[Op.and] || [];

        where[Op.and].push(
            Sequelize.literal(`
            EXISTS (
                SELECT 1
                FROM JSON_TABLE(
                    pricePerPet,
                    '$[*]' COLUMNS (
                        petType VARCHAR(50) PATH '$.petType',
                        dogPrice DECIMAL(10,2) PATH '$.small.price',
                        otherPrice DECIMAL(10,2) PATH '$.price'
                    )
                ) AS price_data
                WHERE
                    (
                        price_data.petType = 'Dog'
                        AND price_data.dogPrice BETWEEN ${min} AND ${max}
                    )
                    OR
                    (
                        price_data.petType <> 'Dog'
                        AND price_data.otherPrice BETWEEN ${min} AND ${max}
                    )
            )
        `)
        );
    }
    if (nameOfBusiness) {
        where.nameOfBusiness = { [Op.like]: `%${nameOfBusiness}%` };
    }
    if (boardingOfPets) {
        if (typeof boardingOfPets === "string") {
            try {
                boardingOfPets = JSON.parse(boardingOfPets);
            } catch {
                boardingOfPets = boardingOfPets.split(",");
            }
        }

        where[Op.and] = where[Op.and] || [];

        const petConditions = boardingOfPets.map((pet) =>
            Sequelize.literal(
                `JSON_SEARCH(boardingOfPets, 'one', '${pet.trim()}') IS NOT NULL`
            )
        );

        // Match ANY pet type
        where[Op.and].push({
            [Op.or]: petConditions
        });
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
        offset,
        attributes: [
            "id",
            "propertyName",
            "status",
            "bussinessType",
            "address",
            "boardingOfPets",
            "nameOfBusiness",
            "boardingOfPets",
            "propertyPhotos",
            "services",
            "pricePerPet",

        ]
    });

    return {
        data: rows,
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit)
    };
}

const getHostForAdminsService = async (
    page = 1,
    limit = 10,
    name = '',
    email = '',
    address = '',
    nameOfBusiness = '',
    boardingOfPets = '',
    amenities = [],
    status = ''
) => {
    const Host = getHost();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    if (status) {
        where.status = status;
    } else {
        where.status = "verified";
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
    console.log(where)
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

module.exports = { addHostService, getHostsService, getHostByIdService, getHostByUserIDService, getHostForAdminsService, updateHostService, updateHostPropertyService };