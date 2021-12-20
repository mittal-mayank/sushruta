const router = require('express').Router();
const { consultationService } = require('../services');
const { consultationController } = require('../controllers');
const { authenticators, uploaders } = require('../middlewares');
const { exceptionHandler } = require('./handlers');

router.get(
    '/:consultationId/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(consultationService.getConsultationById)
);

router.post(
    '/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(consultationService.createConsultation)
);

router.post(
    '/book',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(consultationController.bookConsultation)
);

router.patch(
    '/:consultationId/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(uploaders.uploadPrescription),
    exceptionHandler(consultationService.patchConsultation)
);

module.exports = router;
