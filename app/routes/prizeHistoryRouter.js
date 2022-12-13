// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import prizeHistory controllers
const prizeHistoryController = require('../controllers/prizeHistoryController');

router.post('/prize-histories', prizeHistoryController.createPrizeHistory);

router.get('/prize-histories', prizeHistoryController.getAllPrizeHistory);

router.get("/prize-histories/:prizeHistoryId", prizeHistoryController.getPrizeHistoryById);

router.put("/prize-histories/:prizeHistoryId", prizeHistoryController.updatePrizeHistoryById);

router.delete("/prize-histories/:prizeHistoryId", prizeHistoryController.deletePrizeHistoryById);

//Khai báo API GET /devcamp-lucky-dice/prize-history?username=:username
router.get("/devcamp-lucky-dice/prize-history", prizeHistoryController.prizeHistoryHandler);

module.exports = router;