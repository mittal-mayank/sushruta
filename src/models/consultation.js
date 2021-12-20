const mongoose = require('mongoose');
const { timingSchema } = require('./subschemas');
const { zoom, sendgrid } = require('../utils');
const Doctor = require('./doctor');

const consultationSchema = new mongoose.Schema(
    {
        schedule: {
            type: timingSchema,
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        prescription: {
            type: String,
            trim: true,
            maxlength: 300,
            match: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        },
        zoomLink: {
            type: String,
            trim: true,
            maxlength: 300,
            match: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        },
    },
    { timestamps: true }
);

consultationSchema.pre('save', async function () {
    if (!this.isNew) return;
    const meetingLink = await zoom.getMeetingLink(
        'Sushruta Consultation',
        process.env.ZOOM_PASSWORD,
        this.schedule.start.toISOString()
    );
    this.set('zoomLink', meetingLink);
    const {
        userId: { name: recipientName, email: recipientEmail },
    } = await Doctor.findById(this.doctorId)
        .select('userId')
        .populate({
            path: 'userId',
            select: 'name email',
        })
        .exec();
    await sendgrid.sendEmail(
        recipientEmail,
        recipientName,
        process.env.SENDGRID_PRESC_TEMPLATE,
        Math.round(this.schedule.end.getTime() / 1000)
    );
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
