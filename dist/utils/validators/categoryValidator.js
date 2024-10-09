"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryValidator = exports.updateCategoryValidator = exports.createCategoryValidator = exports.getCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.getCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware_1.default,
];
exports.createCategoryValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Category name required")
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 32 })
        .withMessage("Too long category name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.updateCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid category id format"),
    (0, express_validator_1.check)("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 32 })
        .withMessage("Too long category name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.deleteCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware_1.default,
];
