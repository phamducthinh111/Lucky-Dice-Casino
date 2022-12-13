// Import thư viện Mongoose
const mongoose = require("mongoose");
// Import module prizeModel (dùng để gọi methods find(), create(), findById(),...)
const prizeModel = require('../models/prizeModel');

/*** Get All Prize
 * nhận đầu vào request và response từ router
 * gọi prizeModel lấy tất cả dữ liệu prize từ CSDL và trả về response.
*/
const getAllPrize = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    prizeModel.find((errFindPrize, dataAllPrize) => {
        if(errFindPrize) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errFindPrize.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Get all prize",
            data: dataAllPrize
        })
    })
}

/*** Create Prize
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.body
 * gọi prizeModel thêm dữ liệu prize vào CSDL và trả về response
*/
const createPrize = (request, response) => {
    // B1: chuẩn bị dữ liệu
    const body = request.body;
    // B2: kiểm tra dữ liệu
    if(!body.bodyPrizeName || body.bodyPrizeName.trim() === "") {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Prize Name, is not valid!"
        })
    }   
    // B3: Thao tác CSDL
    const newPrize = {
        _id: mongoose.Types.ObjectId(),
        name: body.bodyPrizeName,
        description: body.bodyPrizeDescription
    }
    prizeModel.create( newPrize, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        //trả về response
        return response.status(201).json({
            status: "Successfully! Create a prize.",
            data: data
        })
    })
}

/*** Get Prize By Id 
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi prizeModel lấy dữ liệu prize từ CSDL bằng prizeId và trả về response.
*/
const getPrizeById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const prizeId = request.params.prizeId;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(prizeId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "PrizeID is not valid"
        })
    }
    // B3: Thao tác CSDL
    prizeModel.findById(prizeId, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        //trả dữ liệu về response
        return response.status(200).json({
            status: "Successfully! Get prize details.",
            data: data
        })
    })
}

/*** Update Prize By Id
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params và request.body
 * gọi prizeModel cập nhật dữ liệu prize vào CSDL bằng prizeId và trả về response
*/
const updatePrizeById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const prizeId = request.params.prizeId;
    const body = request.body;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(prizeId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "prizeID is not valid"
        })
    }
    if( !body.bodyPrizeName || body.bodyPrizeName.trim() === "" ) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Prize Name, is not valid!"
        })
    }
    // B3: Thao tác CSDL
    const updatePrize = {} ;
    if(body.bodyPrizeName !== undefined) {
        updatePrize.name = body.bodyPrizeName
    }
    if(body.bodyPrizeDescription !== undefined) {
        updatePrize.description = body.bodyPrizeDescription
    }
    prizeModel.findByIdAndUpdate( prizeId, updatePrize, (errUpdatePrize, data) => {
        if(errUpdatePrize) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errUpdatePrize.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Updated prize.",
            oldData: data,
            newData: updatePrize
        })
    })
}

/*** Delete prize By Id: xóa khách hàng theo Id
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi prizeModel xóa dữ liệu prize khỏi CSDL bằng prizeId và trả về response
*/
const deletePrizeById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const prizeId = request.params.prizeId;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(prizeId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "prizeId is not valid"
        })
    }
    // B3: Thao tác đến CSDL
    prizeModel.findByIdAndDelete(prizeId, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Deleted prize."
        })
    })
}

//export controllers
module.exports = {
    getAllPrize, 
    createPrize,
    getPrizeById,
    updatePrizeById,
    deletePrizeById
} 