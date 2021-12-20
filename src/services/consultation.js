const { Consultation, Doctor, Payment, User } = require('../models');
const { dataTypesValidator } = require('../validators');

async function createConsultation(req, res) {
    const { schedule, doctorId, patientId } = req.body;
    const attrs = dataTypesValidator({
        mandatoryArgs: {
            ids: { doctorId, patientId },
        },
    });
    if (!attrs) return res.sendStatus(400);
    if (
        !(await Doctor.exists({ _id: attrs.doctorId })) ||
        !(await User.exists({ _id: attrs.patientId }))
    )
        return res.sendStatus(409);
    attrs.schedule = schedule;
    const consultation = await Consultation.create(attrs);
    await Doctor.findByIdAndUpdate(attrs.doctorId, {
        $pull: { roster: schedule },
    });
    res.status(201).json({
        consultationId: consultation._id,
        meetingLink: consultation.zoomLink,
    });
}

async function getConsultationById(req, res) {
    const consultationId = req.params.consultationId;
    const filter = dataTypesValidator({
        mandatoryArgs: { ids: { consultationId } },
    });
    if (!filter) return res.sendStatus(400);
    const consultation = await Consultation.findById(
        filter.consultationId
    ).exec();
    if (!consultation) return res.sendStatus(404);
    res.status(200).json(consultation);
}

async function patchConsultation(req, res) {
    const consultationId = req.params.consultationId;
    const { schedule, prescription, paymentId } = req.body;
    const constraint = dataTypesValidator({
        mandatoryArgs: {
            ids: { consultationId },
        },
    });
    const change = dataTypesValidator({
        optionalArgs: {
            strings: { prescription },
            ids: { paymentId },
        },
    });
    if (!constraint || !change) return res.sendStatus(400);
    if (
        !(await Consultation.exists({ _id: constraint.consultationId })) ||
        (change.paymentId && !(await Payment.exists({ _id: change.paymentId })))
    )
        return res.sendStatus(404);
    change.schedule = schedule;
    await Consultation.findByIdAndUpdate(change.consultationId, change);
    res.sendStatus(204);
}

module.exports = {
    createConsultation,
    getConsultationById,
    patchConsultation,
};
