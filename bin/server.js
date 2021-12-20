if (!process.env.PORT)
    process.env = { ...process.env, ...require('./env.json') };

require('../src/models');

const mongoose = require('mongoose');

mongoose.connection
    .on('connected', async () => {
        console.log('Database connected');

        const app = require('../src');

        app.listen(process.env.PORT, () =>
            console.log(`Server started at port ${process.env.PORT}`)
        );
    })
    .on('disconnect', () => console.log('Database disconnected'))
    .on('error', console.error);
