// Import thư viện mongoose 
const mongoose = require("mongoose");
// Khai báo class Schema 
const Schema = mongoose.Schema;

// Khởi tạo instance prizeHistorySchema từ class Schema
const prizeHistorySchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prize: {
        type: mongoose.Types.ObjectId,
        ref: 'Prize',
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
module.exports = mongoose.model('PrizeHistory', prizeHistorySchema);
