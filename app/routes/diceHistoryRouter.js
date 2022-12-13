// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import user controllers
const diceHistoryController = require('../controllers/diceHistoryController');

router.post('/dice-histories', diceHistoryController.createDiceHistory);
router.get('/dice-histories', diceHistoryController.getAllDiceHistory);
router.get('/dice-histories/:diceHistoryId', diceHistoryController.getDiceHistoryById);
router.put('/dice-histories/:diceHistoryId', diceHistoryController.updateDiceHistoryById);
router.delete('/dice-histories/:diceHistoryId', diceHistoryController.deleteDiceHistoryById);

//Khai báo API GET /devcamp-lucky-dice/dice-history?username=:username
router.get('/devcamp-lucky-dice/dice-history', diceHistoryController.diceHistoryHandler);

module.exports = router;