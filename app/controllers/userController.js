// Import thư viện Mongoose
const mongoose = require("mongoose");
// Import module UserModel 
const userModel = require('../models/userModel');

/*** Get all user: lấy danh sách khách hàng
 * nhận đầu vào request và response từ router
 * gọi userModel lấy tất cả dữ liệu user từ CSDL và trả về response.
*/
const getAllUser = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    userModel.find((error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Get all user successfully",
            data: data
        })
    })
}

/*** Create User: tạo mới khách hàng
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.body
 * gọi userModel thêm dữ liệu User vào CSDL và trả về response
*/
const createUser = (request, response) => {
    // B1: chuẩn bị dữ liệu
    const body = request.body;
    
    // B2: kiểm tra dữ liệu
    if(!body.bodyUserName || body.bodyUserName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "User Name, không hợp lệ!"
        })
    }
    if(!body.bodyFirstName || body.bodyFirstName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "First Name, không hợp lệ!"
        })
    }
    if(!body.bodyLastName || body.bodyLastName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "Last Name, không hợp lệ!"
        })
    }
    
    // B3: Thao tác CSDL
    //Tạo đối tượng chứa request
    const newUser = {
        _id: mongoose.Types.ObjectId(),
        userName: body.bodyUserName,
        firstName: body.bodyFirstName,
        lastName: body.bodyLastName
    }
    // Dùng create() thêm dữ liệu vào CSDL
    userModel.create(newUser, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        //trả về response
        return response.status(201).json({
            status: "Successfully! Create a user.",
            data: data
        })
    })
}

/*** Get User By Id: lấy thông tin khách hàng theo Id
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi userModel lấy dữ liệu user từ CSDL bằng userId và trả về response.
*/
const getUserById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const userId = request.params.userId;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "UserID không hợp lệ"
        })
    }
    // B3: Gọi Model dùng findById(): lấy dữ liệu (CSDL) theo Id
    userModel.findById(userId, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        //trả dữ liệu về response
        return response.status(200).json({
            status: "Successfully! Get user details.",
            data: data
        })
    })
}

/*** Update User By Id: cập nhật thông tin khách hàng
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params và request.body
 * gọi userModel cập nhật dữ liệu user vào CSDL bằng userId và trả về response
*/
const updateUserById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const userId = request.params.userId;
    const body = request.body;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "UserID không hợp lệ"
        })
    }
    if(body.bodyUserName === undefined || body.bodyUserName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "User Name, không hợp lệ!"
        })
    }
    if(body.bodyFirstName === undefined || body.bodyFirstName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "First Name, không hợp lệ!"
        })
    }
    if(body.bodyLastName === undefined || body.bodyLastName.trim() === "") {
        return response.status(400).json({
            status: "Bad Request",
            message: "Last Name, không hợp lệ!"
        })
    }

    // B3: Thao tác CSDL
    const updateUser = {} ;
    if(body.bodyUserName !== undefined) {
        updateUser.userName = body.bodyUserName
    }
    if(body.bodyFirstName !== undefined) {
        updateUser.firstName = body.bodyFirstName
    }
    if(body.bodyLastName !== undefined) {
        updateUser.lastName = body.bodyLastName
    }

    userModel.findByIdAndUpdate( userId, updateUser, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Updated user.",
            data: data
        })
    })
}

/*** Delete User By Id: xóa khách hàng theo Id
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi userModel xóa dữ liệu user khỏi CSDL bằng userId và trả về response
*/
const deleteUserById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const userId = request.params.userId;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        return response.status(400).json({
            status: "Bad Request",
            message: "User ID không hợp lệ"
        })
    }
    // B3: Thao tác đến CSDL (MongoDB)
    userModel.findByIdAndDelete(userId, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Deleted user"
        })
    })
}

//export controllers
module.exports = {
    getAllUser, 
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
} 