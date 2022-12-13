// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import user controllers
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUser);
router.get('/users/:userId', userController.getUserById);
router.put('/users/:userId', userController.updateUserById);
router.delete('/users/:userId', userController.deleteUserById);

module.exports = router;

