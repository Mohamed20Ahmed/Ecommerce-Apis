"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authService_1 = require("../services/authService");
const authValidator_1 = require("../utils/validators/authValidator");
router.post("/signup", authValidator_1.signupValidator, authService_1.signup);
router.post("/login", authValidator_1.loginValidator, authService_1.login);
router.post("/forgotPassword", authService_1.forgotPassword);
router.post("/verifyResetCode", authService_1.verifyResetCode);
router.patch("/resetPassword", authService_1.resetPassword);
exports.default = router;
