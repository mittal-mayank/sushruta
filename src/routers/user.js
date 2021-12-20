const router = require('express').Router();
const { userService } = require('../services');
const { userController } = require('../controllers');
const { authenticators, uploaders } = require('../middlewares');
const { exceptionHandler } = require('./handlers');

router.get(
    '/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(userService.getUsers)
);

router.get(
    '/:userId/',
    exceptionHandler(authenticators.authenticateAPI),
    exceptionHandler(userService.getUserById)
);

router.post(
    '/',
    exceptionHandler(uploaders.uploadAvatar),
    exceptionHandler(userService.createUser)
);

router.post('/:userId/', exceptionHandler(userController.userSignIn));

module.exports = router;
