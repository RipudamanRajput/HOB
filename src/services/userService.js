const { User: getUser } = require('../models/User');
const { Op } = require('sequelize');

const addUser = async (userData) => {
    try {
        const User = getUser();
        const user = await User.create(userData);
        return user.id;
    } catch (error) {
        console.error('Error adding user:', error.message);
        throw new Error('Error adding user');
    }
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
        attributes: ['id', 'name', 'email', 'googleId', 'avatar', 'role']
    });
    return user;
}

const getUserByEmailService = async (email) => {
    const User = getUser();

    return await User.findOne({
        where: { email },
        attributes: [
            'id',
            'name',
            'email',
            'googleId',
            'avatar',
            'role',
            'password'
        ]
    });
};

const updateUserRoleService = async (role, userId) => {
    try {
        const User = getUser();

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        await User.update({ role }, { where: { id: userId } });
        await user.save();
    } catch (error) {
        CONSOLE.log('USER DETAILS:', user);
        console.error('Error updating user role:', error);
        throw new Error('Error updating user role');
    }
}

module.exports = { addUser, getUsers, getUserById, getUserByEmailService, updateUserRoleService };