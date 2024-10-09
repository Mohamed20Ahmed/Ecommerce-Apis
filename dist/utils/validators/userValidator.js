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
exports.deleteUserValidator = exports.changeUserPasswordValidator = exports.updateLoggedUserValidator = exports.updateUserValidator = exports.createUserValidator = exports.getUserValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const userModel_1 = __importDefault(require("../../models/userModel"));
exports.getUserValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User id format"),
    validatorMiddleware_1.default,
];
exports.createUserValidator = [
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
    (0, express_validator_1.check)("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA phone numbers"),
    (0, express_validator_1.check)("profileImg").optional(),
    (0, express_validator_1.check)("role").optional(),
    validatorMiddleware_1.default,
];
exports.updateUserValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User id format"),
    (0, express_validator_1.check)("name")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Too short User name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) => userModel_1.default.findOne({ email: val }).then((email) => {
        if (email) {
            return Promise.reject(new Error("E-mail already in user"));
        }
    })),
    (0, express_validator_1.check)("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA phone numbers"),
    (0, express_validator_1.check)("profileImg").optional(),
    (0, express_validator_1.check)("role").optional(),
    validatorMiddleware_1.default,
];
exports.updateLoggedUserValidator = [
    (0, express_validator_1.check)("name")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Too short User name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) => userModel_1.default.findOne({ email: val }).then((email) => {
        if (email) {
            return Promise.reject(new Error("E-mail already in user"));
        }
    })),
    (0, express_validator_1.check)("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number only accepted EG and SA phone numbers"),
    validatorMiddleware_1.default,
];
exports.changeUserPasswordValidator = [
    (0, express_validator_1.check)("currentPassword")
        .notEmpty()
        .withMessage("You must enter your current password"),
    (0, express_validator_1.check)("passwordConfirm")
        .notEmpty()
        .withMessage("You must enter the password confirm"),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .withMessage("You must enter new password")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        var _b;
        const user = yield userModel_1.default.findById((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
        if (!user) {
            throw new Error("There is no user for this id");
        }
        const isCorrectPassword = yield bcrypt_1.default.compare(req.bodycurrentPassword, user.password);
        if (!isCorrectPassword) {
            throw new Error("Incorrect current password");
        }
        if (val !== req.body.passwordConfirm) {
            throw new Error("Password confirmation incorrect");
        }
        return true;
    })),
    validatorMiddleware_1.default,
];
exports.deleteUserValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid User id format"),
    validatorMiddleware_1.default,
];
