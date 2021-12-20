const { User } = require('../models');
const { dataTypesValidator } = require('../validators');

async function createUser(req, res) {
    const { name, mobile, email, password, dob, sex, avatar } = req.body;
    const attrs = dataTypesValidator({
        mandatoryArgs: {
            strings: { name, mobile, email, password, sex },
            dates: { dob },
        },
    });
    if (!attrs) return res.sendStatus(400);
    if (await User.exists({ mobile: attrs.mobile })) return res.sendStatus(409);
    attrs.avatar = avatar;
    const user = await User.create(attrs);
    res.status(201).json({ userId: user._id });
}

async function getUserById(req, res) {
    const userId = req.params.userId;
    const filter = dataTypesValidator({
        mandatoryArgs: { ids: { userId } },
    });
    if (!filter) return res.sendStatus(400);
    const user = await User.findById(filter.userId).exec();
    if (!user) return res.sendStatus(404);
    res.status(200).json(user);
}

async function getUsers(req, res) {
    const { mobile, email, sex } = req.query;
    const filter = dataTypesValidator({
        optionalArgs: {
            strings: { mobile, email, sex },
        },
    });
    if (!filter) return res.sendStatus(400);
    const users = User.find(filter).exec();
    if (!users.length) return res.sendStatus(404);
    res.status(200).json(users);
}

module.exports = {
    createUser,
    getUserById,
    getUsers,
};
