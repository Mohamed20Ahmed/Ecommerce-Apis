"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const productService_1 = require("../services/productService");
const productValidator_1 = require("../utils/validators/productValidator");
const authService_1 = require("../services/authService");
router
    .route("/")
    .get(productService_1.getProducts)
    .post(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), productService_1.uploadProductImages, productService_1.resizeProductImages, productValidator_1.createProductValidator, productService_1.createProduct);
router
    .route("/:id")
    .get(productValidator_1.getProductValidator, productService_1.getProduct)
    .patch(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), productService_1.uploadProductImages, productService_1.resizeProductImages, productValidator_1.updateProductValidator, productService_1.updateProduct)
    .delete(authService_1.protect, (0, authService_1.allowedTo)("admin"), productValidator_1.deleteProductValidator, productService_1.deleteProduct);
exports.default = router;
