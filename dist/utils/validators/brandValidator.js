"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrandValidator = exports.updateBrandValidator = exports.createBrandValidator = exports.getBrandValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.getBrandValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid brand id format"),
    validatorMiddleware_1.default,
];
exports.createBrandValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Brand name required")
        .isLength({ min: 2 })
        .withMessage("Too short brand name")
        .isLength({ max: 32 })
        .withMessage("Too long brand name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.updateBrandValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid brand id format"),
    (0, express_validator_1.check)("name")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Too short brand name")
        .isLength({ max: 32 })
        .withMessage("Too long brand name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.deleteBrandValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid brand id format"),
    validatorMiddleware_1.default,
];
