const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.post('/register', userController.addUser);

userRouter.post('/login', userController.login);

userRouter.post('/:email', userController.forgotPassword);

userRouter.post('/password/:token', userController.updatePassword);

module.exports = userRouter;
