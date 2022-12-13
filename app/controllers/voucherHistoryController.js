// Import thư viện Mongoose
const mongoose = require("mongoose");
// Import module of model (class Schema)
const voucherHistoryModel = require('../models/voucherHistoryModel');
const userModel = require("../models/userModel");

/**lấy lịch sử voucher 1 user
*in: userId truyền vào query
*out: danh sách voucher của user
*/
const getAllVoucherHistory = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    let userId = request.query.userId;
    let condition = { };
    if (userId) {
        condition.user = userId;
    }
    console.log(condition);
    // B2: Validate dữ liệu
    // B3: Thao tác CSDL
    voucherHistoryModel.find(condition).exec((error, data)  => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: `Successfully! Get all voucher history of user ${userId}`,
            data: data
        })
    })
}

const createVoucherHistory = (request, response) => {
    // B1: chuẩn bị dữ liệu
    const body = request.body;  
    const userId = body.bodyUserId; //Yêu cầu: trường userId truyền vào qua request body json
    const voucherId = body.bodyVoucherId; //Yêu cầu: trường voucherId truyền vào qua request body json
    // B2: kiểm tra dữ liệu
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "userId không hợp lệ!"
        })
    }
    if (!mongoose.Types.ObjectId.isValid(voucherId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "voucherId không hợp lệ!"
        })
    }
    // B3: Thao tác CSDL
    //Tạo đối tượng chứa request
    const newVoucherHistory = {
        user: body.bodyUserId,
        voucher: body.bodyVoucherId
    }
    // Dùng create() thêm dữ liệu vào CSDL
    voucherHistoryModel.create(newVoucherHistory, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(201).json({
            status: "Successfully! Created a voucher history.",
            data: data
        })
    })
}

const getVoucherHistoryById =  (request, response) =>{
    // B1: chuẩn bị dữ liệu
    const voucherHistoryId =  request.params.voucherHistoryId
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(voucherHistoryId)){
     return response.status(400).json({
             status: "Bad request",
             message: "VoucherHistoryId không hợp lệ" 
         })
     }
     // B3: Thao tác CSDL
    voucherHistoryModel.findById( voucherHistoryId, (error,data) => {
        return response.status(200).json({
             status: "Successfully! Get details voucher history ",
             data: data
        })
    })  
}

const updateVoucherHistoryById = ( request, response ) => {
    // B1: chuẩn bị dữ liệu
    const voucherHistoryId =  request.params.voucherHistoryId;
    const body = request.body;
    const userId = body.bodyUserId; //Yêu cầu: trường userId truyền vào qua request body json
    const voucherId = body.bodyVoucherId; //Yêu cầu: trường voucherId truyền vào qua request body json
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(voucherHistoryId)){
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "voucherHistoryId không hợp lệ" 
        })
    }  
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "userId không hợp lệ" 
        })
    } 
    if(!mongoose.Types.ObjectId.isValid(voucherId)){
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "VoucherId không hợp lệ" 
        })
    } 
         
    const updateVoucherHistory= {
        user: body.bodyUserId,
        voucher: body.bodyVoucherId
    }
    // B3: Thao tác CSDL
    voucherHistoryModel.findByIdAndUpdate(voucherHistoryId, updateVoucherHistory, (error,data) =>{
        if(error){
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Updated voucher history",
            data: data
        })
    })  
} 

const deleteVoucherHistoryById = (request, response) => {
    //B1: chuẩn bị dữ liệu
    const voucherHistoryId = request.params.voucherHistoryId;

    //B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(voucherHistoryId)){
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "voucherHistoryId không hợp lệ"
        })
    } 
    //B3: Thao tác CSDL
    voucherHistoryModel.findByIdAndDelete( voucherHistoryId, (error, data)=> {
        if(error){
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(204).json({
            status: "Successfully! Deleted voucher history"
        })
    })
}

//Bài NR4.40: lấy lịch sử voucher
const voucherHistoryHandler = (request, response) => {
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
                //lấy id của user đó để trả ra danh sách Voucher History theo user
                voucherHistoryModel.find({user: userExist._id}, (errFindVoucherHistory, listVoucherHistory) => {
                    if (errFindVoucherHistory) {
                        return response.status(500).json ({
                            status: "Error 500: Internal server error",
                            message: errFindVoucherHistory.message
                        })
                    } else {
                        return response.status(200).json ({
                            status: "Successfully! Get all voucher history by userId",
                            data: listVoucherHistory
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

//export module này
module.exports = {
    getAllVoucherHistory,
    createVoucherHistory,
    getVoucherHistoryById,
    updateVoucherHistoryById,
    deleteVoucherHistoryById,
    voucherHistoryHandler
}