const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: /^[6-9]\d{9}$/,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            lowercase: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 100,
        },
        dob: {
            type: Date,
            required: true,
            min: '1900-01-01',
            validate: (inp) => inp < new Date(),
        },
        sex: {
            type: String,
            enum: ['MALE', 'FEMALE', 'OTHER'],
            required: true,
        },
        avatar: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
            minlength: 1,
            maxlength: 300,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const encPass = await bcrypt.hash(
            this.password,
            +process.env.SALT_ROUNDS
        );
        this.set('password', encPass);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
