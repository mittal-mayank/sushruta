const router = require('express').Router();

router.use('/consultation', require('./consultation'))
router.use('/doctor', require('./doctor'))
router.use('/payment', require('./payment'))
router.use('/user', require('./user'))

module.exports = router;
