"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const categoryService_1 = require("../services/categoryService");
const categoryValidator_1 = require("../utils/validators/categoryValidator");
const subCategoryRoute_1 = __importDefault(require("./subCategoryRoute"));
const authService_1 = require("../services/authService");
router.use("/:categoryId/subCategories", subCategoryRoute_1.default);
router
    .route("/")
    .get(categoryService_1.getCategories)
    .post(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), categoryService_1.uploadCategoryImage, categoryService_1.resizeImage, categoryValidator_1.createCategoryValidator, categoryService_1.createCategory);
router
    .route("/:id")
    .get(categoryValidator_1.getCategoryValidator, categoryService_1.getCategory)
    .patch(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), categoryService_1.uploadCategoryImage, categoryService_1.resizeImage, categoryValidator_1.updateCategoryValidator, categoryService_1.updateCategory)
    .delete(authService_1.protect, (0, authService_1.allowedTo)("admin"), categoryValidator_1.deleteCategoryValidator, categoryService_1.deleteCategory);
exports.default = router;
