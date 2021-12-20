const crypto = require('crypto');
const { Payment } = require('../models');
const { dataTypesValidator } = require('../validators');

async function paymentWebhook(req, res) {
    const {
        razorpay_payment_link_id: razorpayLinkId,
        razorpay_payment_link_reference_id: paymentId,
        razorpay_payment_link_status: paymentDone,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySig,
    } = req.query;
    const input = dataTypesValidator({
        mandatoryArgs: {
            strings: {
                razorpayLinkId,
                paymentId,
                paymentDone,
                razorpayPaymentId,
                razorpaySig,
            },
        },
    });
    if (!input) return res.sendStatus(400);
    const expSig = crypto
        .createHmac('sha256', process.env.RZP_KEY_SECRET)
        .update(
            `${input.razorpayLinkId}` +
                `|${input.paymentId}` +
                `|${input.paymentDone}` +
                `|${input.razorpayPaymentId}`
        )
        .digest('hex');
    if (expSig !== input.razorpaySig) return res.sendStatus(401);
    await Payment.findByIdAndUpdate(input.paymentId, {
        paymentDone: true,
        razorpayPaymentId: input.razorpayPaymentId,
    }).exec();
    res.sendStatus(204);
}

module.exports = { paymentWebhook };
