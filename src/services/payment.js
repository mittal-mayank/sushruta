const { Consultation, Payment } = require('../models');
const { dataTypesValidator } = require('../validators');

async function createPayment(req, res) {
    const { orderType, orderId } = req.body;
    const attrs = dataTypesValidator({
        mandatoryArgs: {
            strings: { orderType },
            ids: { orderId },
        },
    });
    if (!attrs) return res.sendStatus(400);
    switch (attrs.orderType) {
        case 'CONSULTATION':
            if (!(await Consultation.exists({ _id: attrs.orderId })))
                return res.sendStatus(404);
            else break;
        default:
            return res.sendStatus(400);
    }
    const payment = await Payment.create(attrs);
    res.status(201).json({
        paymentId: payment._id,
        paymentLink: payment.razorpayLink,
    });
}

async function getPaymentById(req, res) {
    const paymentId = req.params.paymentId;
    const filter = dataTypesValidator({
        mandatoryArgs: { ids: { paymentId } },
    });
    if (!filter) return res.sendStatus(400);
    const payment = await Payment.findById(filter.paymentId).exec();
    if (!payment) return res.sendStatus(404);
    res.status(200).json(payment);
}

module.exports = {
    createPayment,
    getPaymentById,
};
