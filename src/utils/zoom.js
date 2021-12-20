const superagent = require('superagent');

async function getMeetingLink(topic, password, startTime) {
    const {
        body: { join_url: meetingLink },
    } = await superagent
        .post(
            process.env.ZOOM_NEW_MEET_URL.replace(
                '<userId>',
                process.env.ZOOM_USER_ID
            )
        )
        .send({
            topic,
            type: 2,
            password,
            timezone: process.env.ZOOM_TIMEZONE,
            start_time: startTime,
            settings: { join_before_host: true },
        })
        .set('Authorization', `Bearer ${process.env.ZOOM_JWT_TOKEN}`);
    return meetingLink;
}

module.exports = { getMeetingLink };
