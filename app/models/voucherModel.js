const mongoose = require("mongoose"); // Import thư viện mongoose 
const Schema = mongoose.Schema; // Khai báo class Schema 

// Khởi tạo instance voucherSchema từ class Schema
const voucherSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        required: false
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
module.exports = mongoose.model('Voucher', voucherSchema);
