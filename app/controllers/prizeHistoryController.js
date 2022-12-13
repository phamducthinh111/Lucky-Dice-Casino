// Import thư viện Mongoose
const mongoose = require("mongoose");
// Import module UserModel 
const prizeHistoryModel = require('../models/prizeHistoryModel');
const userModel = require("../models/userModel");

/*** lấy lịch sử phần thưởng 1 user
 * in: userId truyền vào query
 * out: danh sách phần thưởng của user
*/
const getAllPrizeHistory = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    let userId = request.query.userId;
    let condition = { };
    if (userId) {
        condition.user = userId;
    }
    console.log(condition);
    // B2: Validate dữ liệu
    // B3: Thao tác CSDL
    prizeHistoryModel.find(condition).exec((error, data)  => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Get all prizes history of user",
            data: data
        })
    })
}

const createPrizeHistory = (request, response) => {
    // B1: chuẩn bị dữ liệu
    const body = request.body;  
    const userId = body.bodyUserId; //Yêu cầu: trường userId truyền vào qua request body json
    const prizeId = body.bodyPrizeId; //Yêu cầu: trường prizeId truyền vào qua request body json
    // B2: kiểm tra dữ liệu
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "userId không hợp lệ!"
        })
    }
    if (!mongoose.Types.ObjectId.isValid(prizeId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "prizeId không hợp lệ!"
        })
    }
    // B3: Thao tác CSDL
    //Tạo đối tượng chứa request
    const newPrizeHistory = {
        user: body.bodyUserId,
        prize: body.bodyPrizeId
    }
    // Dùng create() thêm dữ liệu vào CSDL
    prizeHistoryModel.create(newPrizeHistory, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        //trả về response
        return response.status(201).json({
            status: "Successfully! Created a prize history.",
            data: data
        })
    })
}

const getPrizeHistoryById =  (request, response) =>{
    // B1: chuẩn bị dữ liệu
    const prizeHistoryId =  request.params.prizeHistoryId
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(prizeHistoryId)){
     return response.status(400).json({
             status: "Bad request",
             message: "prizeHistoryId không hợp lệ" 
         })
     }
     // B3: Thao tác CSDL
    prizeHistoryModel.findById( prizeHistoryId,(error,data) => {
        return response.status(200).json({
             status: "Successfully! Get details prize history ",
             data: data
        })
    })  
}

const updatePrizeHistoryById = ( request, response ) => {
    // B1: chuẩn bị dữ liệu
    const prizeHistoryId =  request.params.prizeHistoryId;
    const body = request.body;
    const userId = body.bodyUserId; //Yêu cầu: trường userId truyền vào qua request body json
    const prizeId = body.bodyPrizeId; //Yêu cầu: trường prizeId truyền vào qua request body json
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(prizeHistoryId)){
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "prizeHistoryId không hợp lệ" 
        })
    }  
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "userId không hợp lệ" 
        })
    } 
    if(!mongoose.Types.ObjectId.isValid(prizeId)){
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "prizeId không hợp lệ" 
        })
    } 
         
    const updatePrizeHistory= {
        user: body.bodyUserId,
        prize: body.bodyPrizeId
    }
    // B3: Thao tác CSDL
    prizeHistoryModel.findByIdAndUpdate(prizeHistoryId, updatePrizeHistory, (error,data) =>{
        if(error){
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Updated prize history",
            data: data
        })
    })  
} 

const deletePrizeHistoryById = (request, response) => {
    //B1: chuẩn bị dữ liệu
    const prizeHistoryID = request.params.prizeHistoryId;

    //B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(prizeHistoryID)){
        return response.status(400).json({
            status: "Bad Request",
            message: "Prize History Id không hợp lệ"
        })
    } 
    //B3:  Gọi model tạo dữ liệu
    prizeHistoryModel.findByIdAndDelete(prizeHistoryID, (error, data)=> {
        if(error){
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        return response.status(204).json({
            status: "Successfully! Deleted prize history"
        })
    })
}

//Bài NR4.30: lấy lịch sử quà tặng
const prizeHistoryHandler = (request, response) => {
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
                //lấy id của user đó để trả ra danh sách Prize History theo user
                prizeHistoryModel.find({user: userExist._id}, (errFindPrizeHistory, listPrizeHistory) => {
                    if (errFindPrizeHistory) {
                        return response.status(500).json ({
                            status: "Error 500: Internal server error",
                            message: errFindPrizeHistory.message
                        })
                    } else {
                        return response.status(200).json ({
                            status: "Successfully! Get all Prize History by userId",
                            data: listPrizeHistory
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

//export module controller
module.exports = {
    getAllPrizeHistory,
    createPrizeHistory,
    getPrizeHistoryById,
    updatePrizeHistoryById,
    deletePrizeHistoryById,
    prizeHistoryHandler
}