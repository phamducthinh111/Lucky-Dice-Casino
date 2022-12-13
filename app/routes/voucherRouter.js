// Khai báo thư viện ExpressJS
const express = require("express");

// Khai báo router app
const router = express.Router();

// Import Voucher controllers
const voucherController = require('../controllers/voucherController');

router.post('/vouchers', voucherController.createVoucher);
router.get('/vouchers', voucherController.getAllVoucher);
router.get('/vouchers/:voucherId', voucherController.getVoucherById);
router.put('/vouchers/:voucherId', voucherController.updateVoucherById);
router.delete('/vouchers/:voucherId', voucherController.deleteVoucherById);

module.exports = router;

