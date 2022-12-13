// Khai báo thư viện ExpressJS
const express = require("express");
// Khai báo router app
const router = express.Router();

// Import Prize controllers
const diceController = require('../controllers/diceController');

router.post('/dice', diceController.diceHandler);

module.exports = router;


