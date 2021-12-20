const superagent = require('superagent');

async function sendEmail(recipientEmail, recipientName, templateId, sendAt) {
    await superagent
        .post(process.env.SENDGRID_API_URL)
        .send({
            personalizations: [
                {
                    to: [
                        {
                            email: recipientEmail,
                            name: recipientName,
                        },
                    ],
                },
            ],
            from: {
                email: process.env.SENDGRID_SENDER_EMAIL,
                name: 'Sushruta',
            },
            reply_to: {
                email: process.env.SENDGRID_SENDER_EMAIL,
                name: 'Sushruta',
            },
            template_id: templateId,
            send_at: sendAt,
        })
        .set('Authorization', `Bearer ${process.env.SENDGRID_API_KEY}`);
}

module.exports = { sendEmail };
