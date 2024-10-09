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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = exports.resizeProductImages = exports.uploadProductImages = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const handlersFactory_1 = __importDefault(require("./handlersFactory"));
const uploadImageMiddleware_1 = require("../middlewares/uploadImageMiddleware");
const productModel_1 = __importDefault(require("../models/productModel"));
exports.uploadProductImages = (0, uploadImageMiddleware_1.uploadMixOfImages)([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
]);
exports.resizeProductImages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let files = Object.assign({ imageCover: [{ buffer: "" }], images: [] }, req.files);
    if (files.imageCover.length && files.imageCover[0].buffer) {
        const imageCoverFileName = `products-${(0, uuid_1.v4)()}-${Date.now()}-cover.jpeg`;
        yield (0, sharp_1.default)(files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`);
        req.body.imageCover = imageCoverFileName;
    }
    if (files.images.length) {
        req.body.images = [];
        yield Promise.all(files.images.map((img, index) => __awaiter(void 0, void 0, void 0, function* () {
            const imageFileName = `products-${(0, uuid_1.v4)()}-${Date.now()}-${index + 1}.jpeg`;
            yield (0, sharp_1.default)(img.buffer)
                .resize(2000, 1333)
                .toFormat("jpeg")
                .jpeg({ quality: 95 })
                .toFile(`uploads/products/${imageFileName}`);
            req.body.images.push(imageFileName);
        })));
    }
    next();
}));
exports.getProducts = handlersFactory_1.default.getAll(productModel_1.default, "Products");
exports.getProduct = handlersFactory_1.default.getOne(productModel_1.default);
exports.createProduct = handlersFactory_1.default.createOne(productModel_1.default);
exports.updateProduct = handlersFactory_1.default.updateOne(productModel_1.default);
exports.deleteProduct = handlersFactory_1.default.deleteOne(productModel_1.default);
