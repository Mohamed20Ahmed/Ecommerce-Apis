"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const brandService_1 = require("../services/brandService");
const brandValidator_1 = require("../utils/validators/brandValidator");
const authService_1 = require("../services/authService");
router
    .route("/")
    .get(brandService_1.getBrands)
    .post(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), brandService_1.uploadBrandImage, brandService_1.resizeImage, brandValidator_1.createBrandValidator, brandService_1.createBrand);
router
    .route("/:id")
    .get(brandValidator_1.getBrandValidator, brandService_1.getBrand)
    .patch(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), brandService_1.uploadBrandImage, brandService_1.resizeImage, brandValidator_1.updateBrandValidator, brandService_1.updateBrand)
    .delete(authService_1.protect, (0, authService_1.allowedTo)("admin"), brandValidator_1.deleteBrandValidator, brandService_1.deleteBrand);
exports.default = router;
