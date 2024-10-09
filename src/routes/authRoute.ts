import express from "express";

const router = express.Router();

import {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../services/authService";
import {
  signupValidator,
  loginValidator,
} from "../utils/validators/authValidator";

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);

router.post("/forgotPassword", forgotPassword);

router.post("/verifyResetCode", verifyResetCode);

router.patch("/resetPassword", resetPassword);

export default router;
