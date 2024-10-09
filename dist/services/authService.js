"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetCode = exports.forgotPassword = exports.allowedTo = exports.protect = exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const createToken_1 = __importDefault(require("../utils/createToken"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, email, password } = req.body;
    const user = yield userModel_1.default.create({ name, slug, email, password });
    const token = (0, createToken_1.default)(user._id);
    res.status(201).json({ data: user, token });
}));
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        return next(new apiError_1.default("Incorrect email or password", 401));
    }
    const token = (0, createToken_1.default)(user._id);
    res.status(200).json({ data: user, token });
}));
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new apiError_1.default("You are not login, Please login to access this route", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    if (typeof decoded === "string") {
        return next(new apiError_1.default("Invalid token", 400));
    }
    const currentUser = yield userModel_1.default.findById(decoded.userId);
    if (!currentUser) {
        return next(new apiError_1.default("The user that belong to this token does no longer exists", 401));
    }
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(String(currentUser.passwordChangedAt.getTime() / 1000), 10);
        if (passChangedTimestamp > decoded.iat) {
            return next(new apiError_1.default("User recently changed his password, please login again..", 401));
        }
    }
    req.user = currentUser;
    next();
}));
const allowedTo = (...roles) => (0, express_async_handler_1.default)((req, res, next) => {
    var _a;
    if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
        return next(new apiError_1.default("You are not allowed to access this route", 403));
    }
    next();
});
exports.allowedTo = allowedTo;
exports.forgotPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return next(new apiError_1.default(`There is no user with that email ${email}`, 404));
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto_1.default
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
    yield userModel_1.default.updateOne({ _id: user._id }, {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
        passwordResetVerified: false,
    });
    const message = `Hi ${user.name}, We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
        yield (0, sendEmail_1.default)({
            email: user.email,
            subject: "Your password reset code (valid for 10 min)",
            message,
        });
    }
    catch (err) {
        yield userModel_1.default.updateOne({ _id: user._id }, {
            passwordResetCode: null,
            passwordResetExpires: null,
            passwordResetVerified: null,
        });
        return next(new apiError_1.default("There is an error in sending email", 500));
    }
    res
        .status(200)
        .json({ status: "Success", message: "Reset code sent to email" });
}));
exports.verifyResetCode = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetCode } = req.body;
    const hashedResetCode = crypto_1.default
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
    const user = yield userModel_1.default.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new apiError_1.default("Reset code invalid or expired", 400));
    }
    yield userModel_1.default.updateOne({ _id: user._id }, {
        passwordResetVerified: true,
    });
    res.status(200).json({ status: "Success" });
}));
exports.resetPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return next(new apiError_1.default(`There is no user with that email ${email}`, 404));
    }
    if (!user.passwordResetVerified) {
        return next(new apiError_1.default("Reset code not verified", 400));
    }
    yield userModel_1.default.updateOne({ _id: user._id }, {
        password: yield bcrypt_1.default.hash(newPassword, 12),
        passwordChangedAt: Date.now(),
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetVerified: null,
    });
    const token = (0, createToken_1.default)(user._id);
    res.status(200).json({ token });
}));
