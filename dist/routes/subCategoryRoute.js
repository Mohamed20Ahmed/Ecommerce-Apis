"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const subCategoryService_1 = require("../services/subCategoryService");
const subCategoryValidator_1 = require("../utils/validators/subCategoryValidator");
const authService_1 = require("../services/authService");
router
    .route("/")
    .get(subCategoryService_1.createFilterObj, subCategoryService_1.getSubCategories)
    .post(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), subCategoryService_1.setCategoryIdToBody, subCategoryValidator_1.createSubCategoryValidator, subCategoryService_1.createSubCategory);
router
    .route("/:id")
    .get(subCategoryValidator_1.getSubCategoryValidator, subCategoryService_1.getSubCategory)
    .patch(authService_1.protect, (0, authService_1.allowedTo)("manager", "admin"), subCategoryValidator_1.updateSubCategoryValidator, subCategoryService_1.updateSubCategory)
    .delete(authService_1.protect, (0, authService_1.allowedTo)("admin"), subCategoryValidator_1.deleteSubCategoryValidator, subCategoryService_1.deleteSubCategory);
exports.default = router;
