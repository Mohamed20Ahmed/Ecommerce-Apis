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
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrand = exports.getBrands = exports.resizeImage = exports.uploadBrandImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const handlersFactory_1 = __importDefault(require("./handlersFactory"));
const uploadImageMiddleware_1 = require("../middlewares/uploadImageMiddleware");
const brandModel_1 = __importDefault(require("../models/brandModel"));
exports.uploadBrandImage = (0, uploadImageMiddleware_1.uploadSingleImage)("image");
exports.resizeImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const filename = `brand-${(0, uuid_1.v4)()}-${Date.now()}.jpeg`;
        (0, sharp_1.default)(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/brands/${filename}`);
        req.body.image = filename;
    }
    next();
}));
exports.getBrands = handlersFactory_1.default.getAll(brandModel_1.default);
exports.getBrand = handlersFactory_1.default.getOne(brandModel_1.default);
exports.createBrand = handlersFactory_1.default.createOne(brandModel_1.default);
exports.updateBrand = handlersFactory_1.default.updateOne(brandModel_1.default);
exports.deleteBrand = handlersFactory_1.default.deleteOne(brandModel_1.default);
