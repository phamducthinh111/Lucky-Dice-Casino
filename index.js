//Khai báo thư viện express
const express = require("express");

// Khai báo thư viện Mongoose
const mongoose = require('mongoose');

//Khai báo App
const app = express();

//Khai báo port chạy App
const port = 8000;

//Khai báo request đọc được body JSON
app.use(express.json());

// Khai báo router app
const userRouter = require("./app/routes/userRouter");
const diceHistoryRouter = require("./app/routes/diceHistoryRouter");
const prizeRouter = require("./app/routes/prizeRouter");
const voucherRouter = require("./app/routes/voucherRouter");
const prizeHistoryRouter = require("./app/routes/prizeHistoryRouter");
const voucherHistoryRouter = require("./app/routes/voucherHistoryRouter");
const diceRouter = require("./app/routes/diceRouter");

//Import module of models (class Schema) => để phát sinh các collection trên MongoDB
const userModel = require("./app/models/userModel");
const diceHistoryModel = require('./app/models/diceHistoryModel');
const prizeModel = require("./app/models/prizeModel");
const prizeHistoryModel = require("./app/models/prizeHistoryModel");
const voucherModel = require("./app/models/voucherModel");
const voucherHistoryModel = require("./app/models/voucherHistoryModel");

//kết nối CSDL Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/CRUD_DiceCasino', (error) => {
    if (error) throw error;
    console.log('Connected to CRUD_DiceCasino successfully!');
})

const methodMiddleware = (req, res, next) => {
    console.log(`Method: ${req.method}`);
    next();
};

const dateMiddleware = (req, res, next) => {
    let today = new Date();
    console.log(`Hôm nay là ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`);
    next();
};

app.use(dateMiddleware, methodMiddleware);

//khai báo thư viện path
const path = require("path");

//khai báo để sử dụng các tài nguyên tĩnh (image, css, js,...)
app.use(express.static("views"));

// Khai báo API GET
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname + "/views/LuckyDiceCasino.html"));
})

// Khai báo API /random-number
app.get("/random-number", (request, response) => {
    const rndNum = Math.floor(Math.random() * 6) + 1
    console.log(rndNum);
    response.status(200).json({
        message: rndNum
    });
})

//App sử dụng các router
app.use( "/api", userRouter);
app.use( "/api", diceHistoryRouter);
app.use( "/api", prizeRouter);
app.use( "/api", voucherRouter);
app.use( "/api", prizeHistoryRouter);
app.use( "/api", voucherHistoryRouter);
app.use( "/devcamp-lucky-dice", diceRouter);

//Khởi động App
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})