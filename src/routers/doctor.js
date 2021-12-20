const router = require('express').Router();
const { doctorService } = require('../services');
const { authenticators } = require('../middlewares');
const { exceptionHandler } = require('./handlers');

router.get(
    '/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(doctorService.getAvailableDoctors)
);

router.get(
    '/:doctorId/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(doctorService.getDoctorById)
);

router.post(
    '/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(doctorService.createDoctor)
);

module.exports = router;
