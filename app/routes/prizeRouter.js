// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import Prize controllers
const prizeController = require('../controllers/prizeController');

router.post('/prizes', prizeController.createPrize);
router.get('/prizes', prizeController.getAllPrize);
router.get('/prizes/:prizeId', prizeController.getPrizeById);
router.put('/prizes/:prizeId', prizeController.updatePrizeById);
router.delete('/prizes/:prizeId', prizeController.deletePrizeById);

module.exports = router;

