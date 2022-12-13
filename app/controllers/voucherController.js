// Import thư viện Mongoose
const mongoose = require("mongoose");
// Import module voucherModel (dùng để gọi methods find(), create(), findById(),...)
const voucherModel = require('../models/voucherModel');

/*** Get All Voucher
 * nhận đầu vào request và response từ router
 * gọi voucherModel lấy tất cả dữ liệu Voucher từ CSDL và trả về response.
*/
const getAllVoucher = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    // B2: Validate dữ liệu
    // B3: Gọi Model tạo dữ liệu
    voucherModel.find((errFindVoucher, dataVoucher) => {
        if(errFindVoucher) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errFindVoucher.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Get all Voucher",
            data: dataVoucher
        })
    })
}

/*** Create Voucher
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.body
 * gọi VoucherModel thêm dữ liệu Voucher vào CSDL và trả về response
*/
const createVoucher = (request, response) => {
    // B1: chuẩn bị dữ liệu
    const body = request.body;
    // B2: kiểm tra dữ liệu
    if( !body.bodyCode || body.bodyCode.trim() === "" ) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Voucher Code is not valid!"
        })
    }  
    if( !body.bodyDiscount || body.bodyDiscount < 0 || body.bodyDiscount > 100) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Discount valid from 0 to 100!"
        })
    }  

    // B3: Thao tác CSDL
    const newVoucher = {
        _id: mongoose.Types.ObjectId(),
        code: body.bodyCode,
        discount: body.bodyDiscount,
        note: body.bodyNote
    }
    voucherModel.create( newVoucher, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        //trả về response
        return response.status(201).json({
            status: "Successfully! Create a Voucher.",
            data: data
        })
    })
}

/*** Get Voucher By Id 
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi voucherModel lấy dữ liệu Voucher từ CSDL bằng voucherId và trả về response.
*/
const getVoucherById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const voucherId = request.params.voucherId;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(voucherId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "voucherId is not valid"
        })
    }
    // B3: Thao tác CSDL
    voucherModel.findById(voucherId, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        //trả dữ liệu về response
        return response.status(200).json({
            status: "Successfully! Get Voucher details.",
            data: data
        })
    })
}

/*** Update Voucher By Id
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params và request.body
 * gọi voucherModel cập nhật dữ liệu Voucher vào CSDL bằng voucherId và trả về response
*/
const updateVoucherById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const voucherId = request.params.voucherId;
    const body = request.body;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(voucherId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "voucherId is not valid!"
        })
    }
    if( !body.bodyCode || body.bodyCode.trim() === "" ) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Voucher Code is not valid!"
        })
    }
    if( !body.bodyDiscount || body.bodyDiscount < 0 || body.bodyDiscount > 100) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "Discount valid from 0 to 100!"
        })
    } 
    // B3: Thao tác CSDL
    const updateVoucher = {} ;
    if(body.bodyCode !== undefined) {
        updateVoucher.code = body.bodyCode
    }
    if(body.bodyDiscount !== undefined) {
        updateVoucher.discount = body.bodyDiscount
    }
    if(body.bodyNote !== undefined) {
        updateVoucher.note = body.bodyNote
    }
    voucherModel.findByIdAndUpdate( voucherId, updateVoucher, (errUpdateVoucher, data) => {
        if(errUpdateVoucher) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errUpdateVoucher.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Updated Voucher",
            oldData: data,
            newData: updateVoucher
        })
    })
}

/*** Delete Voucher By Id: xóa khách hàng theo Id
 * nhận đầu vào request và response từ router
 * lấy dữ liệu JSON từ request.params
 * gọi VoucherModel xóa dữ liệu Voucher khỏi CSDL bằng VoucherId và trả về response
*/
const deleteVoucherById = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    const voucherId = request.params.voucherId;
    // B2: Validate dữ liệu
    if(!mongoose.Types.ObjectId.isValid(voucherId)) {
        return response.status(400).json({
            status: "Error 400: Bad Request",
            message: "voucherId is not valid"
        })
    }
    // B3: Thao tác đến CSDL
    voucherModel.findByIdAndDelete(voucherId, (error, data) => {
        if(error) {
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: error.message
            })
        }
        return response.status(200).json({
            status: "Successfully! Deleted Voucher."
        })
    })
}

//export controllers
module.exports = {
    getAllVoucher: getAllVoucher, 
    createVoucher,
    getVoucherById,
    updateVoucherById,
    deleteVoucherById
} 