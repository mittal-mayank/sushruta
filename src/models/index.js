const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.connect(process.env.DB_URL);

module.exports = {
    Consultation: require('./consultation'),
    Doctor: require('./doctor'),
    Payment: require('./payment'),
    User: require('./user'),
};
