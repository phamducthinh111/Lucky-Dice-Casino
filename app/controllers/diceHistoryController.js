// Import thư viện Mongoose
const mongoose = require("mongoose");
// Import module of models (class Schema)
const diceHistoryModel = require('../models/diceHistoryModel');
const userModel = require("../models/userModel");

/*** Get all dice history: lấy lịch sử các lần chơi của 1 user
 * in: userId truyền vào query
 * gọi diceHistoryModel lấy tất cả dữ liệu DiceHistory từ CSDL và trả về response.
*/
const getAllDiceHistory = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const userId = request.query.userId;
    let condition = { };
    console.log(userId);
    if (userId) {
        condition.user = userId;
    }
    // B2: Validate dữ liệu
    // B3: Thao tác CSDL
    diceHistoryModel.find(condition).exec((error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Get dice history of user",
            data: data
        })
    })
}

/*** Create Dice History: tạo mới lượt Dice
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.body
 * gọi diceHistoryModel thêm dữ liệu DiceHistory vào CSDL và trả về response
*/
const createDiceHistory  = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const body = request.body; 
    //Yêu cầu: trường userId truyền vào qua request body json
    const userId = body.bodyUserId; 
    const diceNumber = Math.floor(Math.random() * 6) + 1 ;
    console.log (`Number of Dice ${diceNumber}`);
    // B2: Validate dữ liệu
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "UserID is not valid!"
        })
    }
    // B3: Thao tác với CSDL
    const newDice = {
        _id: mongoose.Types.ObjectId(),
        user: userId,
        dice: diceNumber
    }
    diceHistoryModel.create(newDice, (error, dataNewDice) => {
        if (error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        return response.status(201).json({
            status: "Successfully! Created new dice",
            data: dataNewDice
        })
    })
}

/*** Get Dice History By ID
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi diceHistoryModel lấy dữ liệu DiceHistory từ CSDL bằng ID và trả về response.
*/
const getDiceHistoryById = (request, response) => {
    const diceHistoryId = request.params.diceHistoryId;
    if (!mongoose.Types.ObjectId.isValid(diceHistoryId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "diceHistoryId is not valid"
        })
    }
    diceHistoryModel.findById(diceHistoryId, (error, data) => {
        if (error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Get dice history",
            data: data
        })
    })
}

/*** Update Dice History By ID
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params và request.body
 * gọi diceHistoryModel cập nhật dữ liệu DiceHistory vào CSDL bằng ID và trả về response.
*/
const updateDiceHistoryById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const diceHistoryId = request.params.diceHistoryId;
    const body = request.body;
    let diceNumber = body.bodyDiceNumber;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(diceHistoryId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "diceHistoryId is not valid"
        })
    }
    if(!mongoose.Types.ObjectId.isValid(body.bodyUserId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "userId is not valid"
        })
    }
    if ( !Number.isInteger(diceNumber) ) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Number of Dice must be integer"
        })
    }
    if ( diceNumber < 1 || diceNumber > 6 ) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Number of Dice must be 1, 2, 3, 4, 5, 6"
        })
    }

    // B3: Thao tác CSDL
    const updateDiceHistory = {} ;
    if(body.bodyUserId !== undefined) {
        updateDiceHistory.user = body.bodyUserId
    }
    if(body.bodyDiceNumber !== undefined) {
        updateDiceHistory.dice = body.bodyDiceNumber
    }
    diceHistoryModel.findByIdAndUpdate(diceHistoryId, updateDiceHistory, (errUpdateDice, data) => {
        if(errUpdateDice) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errUpdateDice.message
            })
        }
        return response.status(200).json({
            status: "Successfully! updated dice history",
            oldData: data,
            newData: updateDiceHistory
        })
    })
}

/*** Delete Dice History By ID: Xóa Dice History theo ID
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi diceHistoryModel xóa dữ liệu Dice History khỏi CSDL bằng diceHistoryId và trả về response.
*/
const deleteDiceHistoryById = (request, response) => {
    // B1: Đọc dữ liệu request
    const diceHistoryId = request.params.diceHistoryId;

    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(diceHistoryId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "diceHistoryId is not valid"
        })
    }

    // B3: Thao tác đến CSDL
    diceHistoryModel.findByIdAndDelete(diceHistoryId, (error) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully deleted dice history"
        })
    })
}

//Bài NR4.20: lấy lịch sử ném
const diceHistoryHandler = (request, response) => {
    // B1: chuẩn bị dữ liệu
    let username = request.query.username;
    // B2: Validate dữ liệu từ request query
    if (!username) {
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "Username is required"
        })
    }
    // B3: Thao tác đến CSDL
    // Sử dụng userModel tìm kiếm bằng username
    userModel.findOne({ userName: username }, (errorFindUser, userExist) => {
        if (errorFindUser) { // nếu tìm user có lỗi
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errorFindUser.message
            })
        } else { // ngược lại (không xảy ra lỗi)
            if (userExist) { //Nếu user đã tồn tại trong hệ thống
                //lấy id của user đó để trả ra danh sách DiceHistory theo user
                diceHistoryModel.find({user: userExist._id}, (errFindDiceHistory, listDiceHistory) => {
                    if (errFindDiceHistory) {
                        return response.status(500).json ({
                            status: "Error 500: Internal server error",
                            message: errFindDiceHistory.message
                        })
                    } else {
                        return response.status(200).json ({
                            status: "Successfully! Get all diceHistory by userId",
                            data: listDiceHistory
                        })
                    }
                })
            } else { // Ngược lại nếu chưa tồn tại 
                // response trả ra mảng rỗng
                return response.status(200).json ({
                    status: "User does not exist",
                    data: []
                })
            }
        }
    })
}

module.exports = { 
    getAllDiceHistory, 
    createDiceHistory, 
    getDiceHistoryById, 
    updateDiceHistoryById, 
    deleteDiceHistoryById,
    diceHistoryHandler
}
