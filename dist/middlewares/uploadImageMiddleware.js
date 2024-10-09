"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMixOfImages = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const multerOptions = () => {
    const multerStorage = multer_1.default.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            cb(new apiError_1.default("Only Images allowed", 400));
        }
    };
    const upload = (0, multer_1.default)({
        storage: multerStorage,
        fileFilter: multerFilter,
    });
    return upload;
};
const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
exports.uploadSingleImage = uploadSingleImage;
const uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);
exports.uploadMixOfImages = uploadMixOfImages;
