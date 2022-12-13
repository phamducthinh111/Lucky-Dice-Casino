const mongoose = require("mongoose"); // Import thư viện mongoose 
const Schema = mongoose.Schema; // Khai báo class Schema 

// Khởi tạo instance userSchema từ class Schema
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
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
module.exports = mongoose.model('User', userSchema);
