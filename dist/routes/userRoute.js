"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userService_1 = require("../services/userService");
const userValidator_1 = require("../utils/validators/userValidator");
const authService_1 = require("../services/authService");
router.use(authService_1.protect);
router.get("/getMe", userService_1.getLoggedUserData, userService_1.getUser);
router.patch("/changeMyPassword", userService_1.updateLoggedUserPassword);
router.patch("/updateMe", userValidator_1.updateLoggedUserValidator, userService_1.updateLoggedUserData);
router.delete("/deleteMe", userService_1.deleteLoggedUserData);
router
    .route("/")
    .get((0, authService_1.allowedTo)("manager", "admin"), userService_1.getUsers)
    .post((0, authService_1.allowedTo)("admin"), userService_1.uploadUserImage, userService_1.resizeImage, userValidator_1.createUserValidator, userService_1.createUser);
router
    .route("/:id")
    .get((0, authService_1.allowedTo)("admin"), userValidator_1.getUserValidator, userService_1.getUser)
    .patch((0, authService_1.allowedTo)("admin"), userService_1.uploadUserImage, userService_1.resizeImage, userValidator_1.updateUserValidator, userService_1.updateUser)
    .delete((0, authService_1.allowedTo)("admin"), userValidator_1.deleteUserValidator, userService_1.deleteUser);
router.put("/changePassword/:id", (0, authService_1.allowedTo)("admin"), userService_1.changeUserPassword);
exports.default = router;
