// Import thư viện mongoose 
const mongoose = require("mongoose");
// Khai báo class Schema 
const Schema = mongoose.Schema;

// Khởi tạo instance voucherHistorySchema từ class Schema
const voucherHistorySchema = new Schema({
    user: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    voucher: {
        type: mongoose.Types.ObjectId, 
        ref: 'Voucher', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});
//export model này ra 1 module
module.exports = mongoose.model('VoucherHistory', voucherHistorySchema);
