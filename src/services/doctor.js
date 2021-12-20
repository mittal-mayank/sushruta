const { Doctor, User } = require('../models');
const { dataTypesValidator } = require('../validators');

async function createDoctor(req, res) {
    const { userId, fee, speciality, qualification, roster } = req.body;
    const attrs = dataTypesValidator({
        mandatoryArgs: {
            strings: { speciality, qualification },
            numbers: { fee },
            ids: { userId },
        },
    });
    if (!attrs) return res.sendStatus(400);
    if (!(await User.exists({ _id: userId }))) return res.sendStatus(404);
    if (await Doctor.exists({ userId: attrs.userId }))
        return res.sendStatus(409);
    attrs.roster = roster;
    const doctor = await Doctor.create(attrs);
    res.status(201).json({ doctorId: doctor._id });
}

async function getDoctorById(req, res) {
    const doctorId = req.params.doctorId;
    const filter = dataTypesValidator({
        mandatoryArgs: { ids: { doctorId } },
    });
    if (!filter) return res.sendStatus(400);
    const doctor = await Doctor.findById(filter.doctorId).exec();
    if (!doctor) return res.sendStatus(404);
    res.status(200).json(doctor);
}

async function getAvailableDoctors(req, res) {
    const { userId, speciality } = req.query;
    const filter = dataTypesValidator({
        optionalArgs: {
            strings: { speciality },
            ids: { userId },
        },
    });
    if (!filter) return res.sendStatus(400);
    filter.roster = { $not: { $size: 0 } };
    const doctors = await Doctor.find(filter).exec();
    if (!doctors.length) return res.sendStatus(404);
    res.status(200).json(doctors);
}

module.exports = {
    createDoctor,
    getDoctorById,
    getAvailableDoctors,
};
