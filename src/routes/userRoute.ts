import express from "express";

const router = express.Router();

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} from "../services/userService";
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} from "../utils/validators/userValidator";
import { protect, allowedTo } from "../services/authService";

router.use(protect);

router.get("/getMe", getLoggedUserData, getUser);

router.patch("/changeMyPassword", updateLoggedUserPassword);

router.patch("/updateMe", updateLoggedUserValidator, updateLoggedUserData);

router.delete("/deleteMe", deleteLoggedUserData);

router
  .route("/")
  .get(allowedTo("manager", "admin"), getUsers)
  .post(
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(allowedTo("admin"), getUserValidator, getUser)
  .patch(
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(allowedTo("admin"), deleteUserValidator, deleteUser);

router.put("/changePassword/:id", allowedTo("admin"), changeUserPassword);

export default router;
