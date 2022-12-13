const mongoose = require("mongoose"); // Import thư viện mongoose 
const Schema = mongoose.Schema; // Khai báo class Schema 

// Khởi tạo instance prizeSchema từ class Schema
const prizeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
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
module.exports = mongoose.model('Prize', prizeSchema);
