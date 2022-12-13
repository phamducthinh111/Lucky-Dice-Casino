const mongoose = require("mongoose");

const diceHistoryModel = require("../models/diceHistoryModel");
const prizeHistoryModel = require("../models/prizeHistoryModel");
const prizeModel = require("../models/prizeModel");
const userModel = require("../models/userModel");
const voucherHistoryModel = require("../models/voucherHistoryModel");
const voucherModel = require("../models/voucherModel");

const diceHandler = (request, response) => {
    // B1: Chuẩn bị dữ liệu
    let username = request.body.username;
    let firstname = request.body.firstname;
    let lastname = request.body.lastname;
    // Random 1 giá trị xúc xắc bất kỳ, dice có giá trị từ 1 đến 6
    const dice = Math.floor(Math.random() * 6 + 1);

    // B2: Validate dữ liệu từ request body
    if (!username) {
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "Username is required"
        })
    }

    if (!firstname) {
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "Firstname is required"
        })
    }

    if (!lastname) {
        return response.status(400).json({
            status: "Error 400: Bad request",
            message: "Lastname is required"
        })
    }

    // B3: Thao tác đến CSDL
    // Sử dụng userModel tìm kiếm bằng username
    userModel.findOne({ userName: username }, (errorFindUser, userExist) => {
        if (errorFindUser) { // nếu tìm user CÓ LỖI
            return response.status(500).json({
                status: "Error 500: Internal server error",
                message: errorFindUser.message
            })
        } else { // ngược lại, tìm user KHÔNG LỖI
            if (!userExist) { // Nếu User KHÔNG tồn tại trong hệ thống
                userModel.create({  // tạo mới User
                    _id: mongoose.Types.ObjectId(),
                    userName: username,
                    firstName: firstname,
                    lastName: lastname
                }, (errCreateUser, userCreated) => {
                    if (errCreateUser) {  //nếu tạo mới user xảy ra lỗi
                        return response.status(500).json({
                            status: "Error 500: Internal server error",
                            message: errCreateUser.message
                        })
                    } else { // ngược lại (không xảy ra lỗi)
                        diceHistoryModel.create({ // tạo mới Dice History ( tạo 1 lần quay xúc xắc)
                            _id: mongoose.Types.ObjectId(),
                            user: userCreated._id, // lấy userId mới tạo, để tạo DiceHistory
                            dice: dice
                        }, (errorDiceHistoryCreate, diceHistoryCreated) => {
                            if (errorDiceHistoryCreate) { // nếu tạo DiceHistory có lỗi
                                return response.status(500).json({
                                    status: "Error 500: Internal server error",
                                    message: errorDiceHistoryCreate.message
                                })
                            } else {  // ngược lại, tạo DiceHistory không lỗi
                                if (dice < 3) { // Nếu dice < 3, không nhận được voucher và prize gì cả
                                    return response.status(200).json({
                                        dice: dice,
                                        prize: null,
                                        voucher: null
                                    })
                                } else { // ngược lại (dice >= 3) 
                                    // thực hiện lấy random một giá trị voucher bất kỳ trong hệ thống 
                                    // hàm count() để lấy tổng số bản ghi trong collection Voucher  
                                    voucherModel.count().exec((errorCountVoucher, countVoucher) => {
                                        console.log (countVoucher); 
                                        // lấy 1 số ngẫu nhiên trong n Voucher
                                        let randomVoucher = Math.floor(Math.random * countVoucher); 
                                        // tìm phần tử đầu tiên, bỏ qua (skip) n-1 Voucher
                                        voucherModel.findOne().skip(randomVoucher).exec((errorFindVoucher, findVoucher) => {
                                            if (errorFindVoucher) {  //nếu xảy ra lỗi
                                                return response.status(500).json({
                                                    status: "Error 500: Internal server error",
                                                    message: errorFindVoucher.message
                                                })
                                            } else { // ngược lại (không xảy ra lỗi)
                                                // Lưu vào VoucherHistory collection
                                                voucherHistoryModel.create({
                                                    _id: mongoose.Types.ObjectId(),
                                                    user: userCreated._id,
                                                    voucher: findVoucher._id
                                                }, (errorCreateVoucherHistory, voucherHistoryCreated) => {
                                                    if (errorCreateVoucherHistory) { // nếu xảy ra lỗi
                                                        return response.status(500).json({
                                                            status: "Error 500: Internal server error",
                                                            message: errorCreateVoucherHistory.message
                                                        })
                                                    } else { // ngược lại (không xảy ra lỗi)
                                                        return response.status(200).json({
                                                            dice: dice,
                                                            prize: null, // User mới không có prize
                                                            voucher: findVoucher
                                                        })                                                       
                                                    }
                                                })
                                            }
                                        })
                                    })
                                }
                            }
                        })
                    }
                })
            } else { // Ngược lại, user CÓ tồn tại trong hệ thống
                diceHistoryModel.create({
                    _id: mongoose.Types.ObjectId(),
                    user: userExist._id, // lấy userId tạo Dice History
                    dice: dice // Xúc xắc 1 lần, lưu lịch sử vào Dice History
                }, (errorDiceHistoryCreate, diceHistoryCreated) => {
                    if (errorDiceHistoryCreate) {
                        return response.status(500).json({
                            status: "Error 500: Internal server error",
                            message: errorDiceHistoryCreate.message
                        })
                    } else {
                        if (dice < 3) { // Nếu dice < 3, không nhận được voucher và prize gì cả 
                            return response.status(200).json({
                                dice: dice,
                                prize: null,
                                voucher: null
                            })
                        } else { // Ngược lại, dice >= 3
                            // Thực hiện lấy random một giá trị voucher bất kỳ trong hệ thống    
                            voucherModel.count().exec((errorCountVoucher, countVoucher) => {
                                let randomVoucher = Math.floor(Math.random * countVoucher);
                                voucherModel.findOne().skip(randomVoucher).exec((errorFindVoucher, findVoucher) => {
                                    voucherHistoryModel.create({ //Thêm một bản ghi vào VoucherHistory
                                        _id: mongoose.Types.ObjectId(),
                                        user: userExist._id,
                                        voucher: findVoucher._id
                                    }, (errorCreateVoucherHistory, voucherHistoryCreated) => {
                                        if (errorCreateVoucherHistory) {
                                            return response.status(500).json({
                                                status: "Error 500: Internal server error",
                                                message: errorCreateVoucherHistory.message
                                            })
                                        } else {
                                            // Lấy 3 lần gieo xúc xắc gần nhất của user
                                            diceHistoryModel.find().sort({ _id: -1 }).limit(3).exec((errorFindLast3DiceHistory, last3DiceHistory) => {
                                                if (errorFindLast3DiceHistory) {
                                                    return response.status(500).json({
                                                        status: "Error 500: Internal server error",
                                                        message: errorFindLast3DiceHistory.message
                                                    })
                                                } else {
                                                    if (last3DiceHistory.length < 3) { // Nếu chưa ném đủ 3 lần
                                                        return response.status(200).json({
                                                            dice: dice,
                                                            prize: null, // không nhận được thưởng
                                                            voucher: findVoucher
                                                        })
                                                    } else {
                                                        console.log(last3DiceHistory)
                                                        // Kiểm tra 3 dice gần nhất
                                                        let checkHavePrize = true;
                                                        last3DiceHistory.forEach( diceHistory => {
                                                            if ( diceHistory.dice < 3 ) { // Nếu 3 lần gần nhất có 1 lần xúc xắc < 3
                                                                checkHavePrize = false; // không có giải thưởng
                                                            }
                                                        });

                                                        if (!checkHavePrize) {
                                                            return response.status(200).json({
                                                                dice: dice,
                                                                prize: null,
                                                                voucher: findVoucher
                                                            })
                                                        } else {
                                                            // Nếu dice 3 lần gần nhất đều lớn hơn 3), 
                                                            // tiến hành lấy random 1 prize trong prize Model
                                                            prizeModel.count().exec((errorCountPrize, countPrize) => {
                                                                let randomPrize = Math.floor(Math.random * countPrize);
                                                                prizeModel.findOne().skip(randomPrize).exec((errorFindPrize, findPrize) => {
                                                                    prizeHistoryModel.create({ //Thêm một bản ghi vào PrizeHistory
                                                                        _id: mongoose.Types.ObjectId(),
                                                                        user: userExist._id,
                                                                        prize: findPrize._id
                                                                    }, (errorCreatePrizeHistory, voucherPrizeCreated) => {
                                                                        if (errorCreatePrizeHistory) {
                                                                            return response.status(500).json({
                                                                                status: "Error 500: Internal server error",
                                                                                message: errorCreatePrizeHistory.message
                                                                            })
                                                                        } else {
                                                                            // Trả về kết quả cuối cùng
                                                                            return response.status(200).json({
                                                                                dice: dice,
                                                                                prize: findPrize,
                                                                                voucher: findVoucher
                                                                            })
                                                                        }
                                                                    })
                                                                })
                                                            })
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    })
                                })
                            })
                        }
                    }
                })
            }
        }
    })
}

module.exports = {
    diceHandler
}