const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const routers = require('./routers');

const app = express();

app.use(
    session({
        store: MongoStore.create({ mongoUrl: process.env.STORE_URL }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.STORE_SECRET,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('./uploads'));
app.use('/api', routers);

app.use((err, req, res, next) => {
    res.status(500).json(err);
    console.error(err);
});

module.exports = app;
