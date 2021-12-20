const { Consultation, Doctor, Payment, User } = require('../models');
const { dataTypesValidator } = require('../validators');

async function bookConsultation(req, res) {
    const { schedule, doctorId, patientId } = req.body;
    const consultationAttrs = dataTypesValidator({
        mandatoryArgs: {
            ids: { doctorId, patientId },
        },
    });
    if (!consultationAttrs) return res.sendStatus(400);
    if (
        !(await Doctor.exists({ _id: consultationAttrs.doctorId })) ||
        !(await User.exists({ _id: consultationAttrs.patientId }))
    )
        return res.sendStatus(404);
    consultationAttrs.schedule = schedule;
    const consultation = await Consultation.create(consultationAttrs);
    await Doctor.findByIdAndUpdate(consultationAttrs.doctorId, {
        $pull: { roster: schedule },
    });
    const paymentAttrs = {
        orderType: 'CONSULTATION',
        orderId: consultation._id,
    };
    const payment = await Payment.create(paymentAttrs);
    consultation.paymentId = payment._id;
    await consultation.save();
    res.status(201).json({
        consultationId: consultation._id,
        meetingLink: consultation.zoomLink,
        paymentId: payment._id,
        paymentLink: payment.razorpayLink,
    });
}

module.exports = { bookConsultation };
