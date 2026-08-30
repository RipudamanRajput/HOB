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

module.exports = {
    addPaymentService,
    updatePaymentService
};