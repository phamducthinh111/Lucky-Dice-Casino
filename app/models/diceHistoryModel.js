// Import thư viện mongoose 
const mongoose = require("mongoose");
// Khai báo class Schema 
const Schema = mongoose.Schema;

// Khởi tạo instance diceHistorySchema từ class Schema
const diceHistorySchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dice: {
        type: Number,
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
module.exports = mongoose.model('DiceHistory', diceHistorySchema);
