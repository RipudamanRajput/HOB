const { User: getUser } = require('../models/User');
const { Op, fn, col } = require('sequelize');
const { Customer: getCustomer } = require("../models/CustomerModel");
const { Booking: getBookingModel } = require('../models/bookingModel');
const { Host: getHost } = require('../models/HostModel');

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

const getUsers = async (page = 1, limit = 10, name = '', email = '', hostStatus = '', role = '') => {
    const User = getUser();
    const Customer = getCustomer();
    const Booking = getBookingModel();
    const Host = getHost();

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (role) where.role = { [Op.eq]: `${role}`};

    // host include - if hostStatus provided, make it a required include with where
    const hostInclude = hostStatus
      ? { model: Host, as: 'host', attributes: ['id', 'status'], required: true, where: { status: hostStatus } }
      : { model: Host, as: 'host', attributes: ['id', 'status'], required: false };

    const users = await User.findAll({
        where,
        include: [
            {
                model: Customer,
                as: 'customer',
                attributes: [],
                required: false,
                include: [
                    {
                        model: Booking,
                        as: 'bookings',
                        attributes: []
                    }
                ]
            },
            hostInclude
        ],
        attributes: [
            'id',
            'name',
            'email',
            'role',
            'createdAt',
            [fn('COUNT', col('customer->bookings.id')), 'bookingCount'],
            [col('host.status'), 'hostStatus']
        ],
        group: hostStatus ? ['User.id', 'host.id', 'host.status'] : ['User.id', 'host.id', 'host.status'],
        limit,
        offset,
        subQuery: false
    });

    // total should respect hostStatus filter
    const countInclude = hostStatus ? [hostInclude] : [];
    const total = await User.count({ where, include: countInclude, distinct: true });

    const data = users.map(u => {
        const obj = u.toJSON();
        obj.bookingCount = parseInt(obj.bookingCount || 0, 10);
        obj.hostStatus = obj.hostStatus ?? (obj.host ? obj.host.status : null);
        if (!obj.host) delete obj.host;
        return obj;
    });

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

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