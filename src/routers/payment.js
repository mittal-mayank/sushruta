const router = require('express').Router();
const { paymentService } = require('../services');
const { paymentController } = require('../controllers');
const { authenticators } = require('../middlewares');
const { exceptionHandler } = require('./handlers');

router.get('/webhook/', exceptionHandler(paymentController.paymentWebhook));

router.get(
    '/:paymentId/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(paymentService.getPaymentById)
);

router.post(
    '/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(paymentService.createPayment)
);

module.exports = router;
