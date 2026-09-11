const { getPaymentModel } = require("../models/paymentModel");

const addPaymentService = async (paymentData) => {
    const Payment = getPaymentModel();
    const newPayment = await Payment.create(paymentData);
    return newPayment;
}

const updatePaymentService = async (orderId, updateData) => {
    const Payment = getPaymentModel();
    const [updatedRows] = await Payment.update(updateData, {
        where: { orderId: orderId }
    });
    return updatedRows;
}

// ************ for admin use only ***********
const getAllPaymentsService = async (page = 1, limit = 10) => {
    const Payment = getPaymentModel();
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await Payment.findAndCountAll({
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
};

module.exports = {
    addPaymentService,
    updatePaymentService,
    getAllPaymentsService
};