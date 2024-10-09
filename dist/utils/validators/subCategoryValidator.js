"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategoryValidator = exports.updateSubCategoryValidator = exports.createSubCategoryValidator = exports.getSubCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.getSubCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid subCategory id format"),
    validatorMiddleware_1.default,
];
exports.createSubCategoryValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("SubCategory name required")
        .isLength({ min: 2 })
        .withMessage("Too short subCategory name")
        .isLength({ max: 32 })
        .withMessage("Too long subCategory name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("category")
        .notEmpty()
        .withMessage("SubCategory must be belong to category")
        .isMongoId()
        .withMessage("Invalid category id format"),
    validatorMiddleware_1.default,
];
exports.updateSubCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid subCategory id format"),
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("SubCategory name required")
        .isLength({ min: 2 })
        .withMessage("Too short subCategory name")
        .isLength({ max: 32 })
        .withMessage("Too long subCategory name"),
    (0, express_validator_1.check)("category")
        .optional()
        .notEmpty()
        .withMessage("SubCategory must be belong to category")
        .isMongoId()
        .withMessage("Invalid category id format")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.deleteSubCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid subCategory id format"),
    validatorMiddleware_1.default,
];
