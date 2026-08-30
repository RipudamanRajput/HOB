const crypto = require('crypto');
const { createPaymentOrder, fetchPaymentDetails } = require('../services/razorpay/razorpayService');
const { addPaymentService, updatePaymentService } = require('../services/paymentService');

const createOrder = async (req, res) => {
    try {
        const {
            amount,
            bookingId
        } = req.body;

        const order = await createPaymentOrder({
            amount,
            bookingId
        });

        await addPaymentService({
            orderId: order.id,
            bookingId,
            amount
        });

        res.status(200).json({
            success: true,
            message: 'Payment order created successfully',
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                bookingId
            }
        });

    } catch (error) {
        console.error('Create payment order error:', error);
        throw error;

    }
};


const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body =
            `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
        const payment = await fetchPaymentDetails(razorpay_payment_id);

        await updatePaymentService(razorpay_order_id, {
            paymentId: payment.id,
            status: payment.status
        });

        // PAYMENT VERIFIED
        // Update booking payment status here

        return res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: payment.id
        });

    } catch (error) {
        console.error('Payment verification error:', error);

        return res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment
};