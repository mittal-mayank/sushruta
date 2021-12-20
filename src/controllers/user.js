const { User } = require('../models');
const bcrypt = require('bcrypt');
const { dataTypesValidator } = require('../validators');

async function userSignIn(req, res) {
    const userId = req.params.userId;
    const password = req.body.password;
    const input = dataTypesValidator({
        mandatoryArgs: {
            strings: { password },
            ids: { userId },
        },
    });
    if (!input) return res.sendStatus(400);
    const user = await User.findById(input.userId).select('password').exec();
    if (!user) return res.sendStatus(404);
    if (!(await bcrypt.compare(input.password, user.password)))
        return res.sendStatus(401);
    req.session.userId = input.userId;
    res.sendStatus(204);
}

module.exports = { userSignIn };
