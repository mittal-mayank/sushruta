const mongoose = require('mongoose');
const { razorpay } = require('../utils');
const Consultation = require('./consultation');

const paymentSchema = new mongoose.Schema(
    {
        orderType: {
            type: String,
            enum: ['CONSULTATION'],
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'orderType',
            required: true,
        },
        invoice: mongoose.Schema.Types.Mixed,
        paymentDone: {
            type: Boolean,
            default: false,
        },
        razorpayLink: {
            type: String,
            trim: true,
            maxlength: 300,
            match: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        },
        razorpayLinkId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            minlength: 5,
            maxlength: 100,
        },
        razorpayPaymentId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            minlength: 5,
            maxlength: 100,
        },
    },
    { timestamps: true }
);

paymentSchema.pre('save', async function () {
    if (!this.isNew) return;
    if (this.orderType != 'CONSULTATION') return;
    const consultation = await Consultation.findById(this.orderId)
        .select('doctorId patientId')
        .populate([
            {
                path: 'doctorId',
                select: 'fee',
            },
            {
                path: 'patientId',
                select: 'name mobile email',
            },
        ])
        .exec();
    const {
        doctorId: { fee },
        patientId: { name, mobile, email },
    } = consultation;
    const { paymentLink, paymentLinkId } = await razorpay.getPaymentLink(
        fee,
        'Payment for Consultation',
        this._id,
        name,
        mobile,
        email
    );
    this.set({
        razorpayLink: paymentLink,
        razorpayLinkId: paymentLinkId,
    });
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
