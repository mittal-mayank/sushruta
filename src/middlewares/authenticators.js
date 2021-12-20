function authenticateAPI(req, res, next) {
    if (req.session.userId) return next();
    res.sendStatus(401);
}

module.exports = { authenticateAPI };
