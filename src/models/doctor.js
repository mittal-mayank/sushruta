const mongoose = require('mongoose');
const { timingSchema } = require('./subschemas');

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        fee: {
            type: Number,
            required: true,
            min: 0,
            max: 1e5,
        },
        speciality: {
            type: String,
            enum: [
                'CARDIOLOGIST',
                'PEDIATRIC',
                'DERMATOLOGIST',
                'GYNAECOLOGIST',
                'UROLOGIST',
            ],
            required: true,
        },
        qualification: {
            type: String,
            enum: ['MBBS', 'MS', 'MD'],
            required: true,
        },
        roster: [timingSchema],
    },
    { timestamps: true }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
