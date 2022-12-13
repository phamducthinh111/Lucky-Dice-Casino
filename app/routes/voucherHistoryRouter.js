// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import voucherHistory controllers
const voucherHistoryController = require('../controllers/voucherHistoryController');

router.post('/voucher-histories', voucherHistoryController.createVoucherHistory);

router.get('/voucher-histories', voucherHistoryController.getAllVoucherHistory);

router.get("/voucher-histories/:voucherHistoryId", voucherHistoryController.getVoucherHistoryById);

router.put("/voucher-histories/:voucherHistoryId", voucherHistoryController.updateVoucherHistoryById);

router.delete("/voucher-histories/:voucherHistoryId", voucherHistoryController.deleteVoucherHistoryById);

//Khai báo API GET /devcamp-lucky-dice/voucher-history?username=:username
router.get("/devcamp-lucky-dice/voucher-history", voucherHistoryController.voucherHistoryHandler);

module.exports = router;