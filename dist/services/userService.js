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
exports.deleteLoggedUserData = exports.updateLoggedUserData = exports.updateLoggedUserPassword = exports.getLoggedUserData = exports.deleteUser = exports.changeUserPassword = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = exports.resizeImage = exports.uploadUserImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const handlersFactory_1 = __importDefault(require("./handlersFactory"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const uploadImageMiddleware_1 = require("../middlewares/uploadImageMiddleware");
const createToken_1 = __importDefault(require("../utils/createToken"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.uploadUserImage = (0, uploadImageMiddleware_1.uploadSingleImage)("profileImg");
exports.resizeImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = `user-${(0, uuid_1.v4)()}-${Date.now()}.jpeg`;
    if (req.file) {
        yield (0, sharp_1.default)(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${filename}`);
        req.body.profileImg = filename;
    }
    next();
}));
exports.getUsers = handlersFactory_1.default.getAll(userModel_1.default);
exports.getUser = handlersFactory_1.default.getOne(userModel_1.default);
exports.createUser = handlersFactory_1.default.createOne(userModel_1.default);
exports.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, slug, phone, email, profileImg, role } = req.body;
    const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, { name, slug, phone, email, profileImg, role }, {
        new: true,
    });
    if (!user) {
        return next(new apiError_1.default(`No user for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: user });
}));
exports.changeUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, {
        password: yield bcrypt_1.default.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    }, {
        new: true,
    });
    if (!user) {
        return next(new apiError_1.default(`No user for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: user });
}));
exports.deleteUser = handlersFactory_1.default.deleteOne(userModel_1.default);
exports.getLoggedUserData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.params.id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    next();
}));
exports.updateLoggedUserPassword = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield userModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
        password: yield bcrypt_1.default.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    }, {
        new: true,
    });
    if (!user) {
        return next(new apiError_1.default("User not found", 404));
    }
    const token = (0, createToken_1.default)(user._id);
    res.status(200).json({ data: user, token });
}));
exports.updateLoggedUserData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const updatedUser = yield userModel_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }, {
        new: true,
    });
    res.status(200).json({ data: updatedUser });
}));
exports.deleteLoggedUserData = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield userModel_1.default.updateOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, {
        active: false,
    });
    res.status(204).json({ status: "Success" });
}));
