const { Customer: getCustomer } = require("../models/Customer");

const addCustomerService = async (customerData) => {
    const Customer = getCustomer();
    const customer = await Customer.create(customerData);
    return customer.id;
}

const getCustomersService = async (page = 1, limit = 10, name = '', email = '') => {
    const Customer = getCustomer();
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

    const { count, rows } = await Customer.findAndCountAll({
        where,
        limit,
        offset
        // attributes: ['id', 'name', 'contactNumber', 'email', 'petProfile', 'petType', 'petName', 'petAge', 'petGender', 'petSize', 'vaccinationDate', 'tickTreatmentStatus', 'tickTreatmentDate', 'healthIssues', 'healthIssuesDescription', 'medicalHistory', 'medicalHistoryDescription', 'behavioralIssues', 'behavioralIssuesDescription']
    });

    return {
        data: rows,
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit)
    };
}

const getCustomerByIdService = async (customerId) => {
    const Customer = getCustomer();
    const customer = await Customer.findByPk(customerId);
    return customer;
}

module.exports = { addCustomerService, getCustomersService, getCustomerByIdService };