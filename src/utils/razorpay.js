const superagent = require('superagent');

const RZP_AUTH_KEY = Buffer.from(
    `${process.env.RZP_KEY_ID}:${process.env.RZP_KEY_SECRET}`
).toString('base64');

async function getPaymentLink(
    amount,
    description,
    refId,
    custName,
    custMobile,
    custEmail
) {
    const {
        body: { short_url: paymentLink, id: paymentLinkId },
    } = await superagent
        .post(process.env.RZP_NEW_PAYMENT_URL)
        .send({
            amount: amount * 100,
            description,
            reference_id: refId,
            customer: {
                name: custName,
                contact: custMobile,
                email: custEmail,
            },
            notify: {
                sms: true,
                email: true,
            },
            callback_url: `${process.env.DEPLOYMENT_URL}api/payment/webhook/`,
            callback_method: 'get',
        })
        .set('Authorization', `Basic ${RZP_AUTH_KEY}`);
    return { paymentLink, paymentLinkId };
}

module.exports = { getPaymentLink };
