const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema(
    {
        start: {
            type: Date,
            required: true,
            validate: function () {
                return this.start < this.end;
            },
        },
        end: {
            type: Date,
            required: true,
        },
    },
    { _id: false }
);

module.exports = { timingSchema };
