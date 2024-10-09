"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const userModel_1 = __importDefault(require("../../models/userModel"));
exports.signupValidator = [
    (0, express_validator_1.check)("name")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Too short User name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) => userModel_1.default.findOne({ email: val }).then((email) => {
        if (email) {
            return Promise.reject(new Error("E-mail already in user"));
        }
    })),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom((val, { req }) => {
        if (val !== req.body.passwordConfirm) {
            throw new Error("Password confirmation incorrect");
        }
        return true;
    }),
    (0, express_validator_1.check)("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation required"),
    validatorMiddleware_1.default,
];
exports.loginValidator = [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address"),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    validatorMiddleware_1.default,
];
