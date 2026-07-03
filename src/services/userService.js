const { User: getUser } = require('../models/User');
const { Op } = require('sequelize');

const addUser = async (userData) => {
    const User = getUser();
    const user = await User.create(userData);
    return user.id;
}

const getUsers = async (page = 1, limit = 10, name = '', email = '') => {
    const User = getUser();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
        where.email = { [Op.like]: `%${email}%` };
    }

    const { count, rows } = await User.findAndCountAll({
        where,
        limit,
        offset,
        attributes: ['id', 'name', 'email']
    });

    return {
        data: rows,
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit)
    };
}

const getUserById = async (userId) => {
    const User = getUser();
    const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'googleId', 'avatar']
    });
    return user;
}

module.exports = { addUser, getUsers, getUserById };