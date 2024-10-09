import crypto from "crypto";

import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";

import ApiError from "../utils/apiError";
import sendEmail from "../utils/sendEmail";
import createToken from "../utils/createToken";
import User from "../models/userModel";

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, email, password } = req.body;

    const user = await User.create({ name, slug, email, password });

    const token = createToken(user._id as string);

    res.status(201).json({ data: user, token });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError("Incorrect email or password", 401));
    }

    const token = createToken(user._id as string);

    res.status(200).json({ data: user, token });
  }
);

interface CustomRequest extends Request {
  user?: { [key: string]: any };
}

export const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ApiError(
          "You are not login, Please login to access this route",
          401
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

    if (typeof decoded === "string") {
      return next(new ApiError("Invalid token", 400));
    }

    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return next(
        new ApiError(
          "The user that belong to this token does no longer exists",
          401
        )
      );
    }

    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(
        String(currentUser.passwordChangedAt.getTime() / 1000),
        10
      );

      if (passChangedTimestamp > (decoded.iat as number)) {
        return next(
          new ApiError(
            "User recently changed his password, please login again..",
            401
          )
        );
      }
    }

    req.user = currentUser;

    next();
  }
);

export const allowedTo = (...roles: string[]) =>
  asyncHandler((req: CustomRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }

    next();
  });

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ApiError(`There is no user with that email ${email}`, 404)
      );
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    await User.updateOne(
      { _id: user._id },
      {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
        passwordResetVerified: false,
      }
    );

    const message = `Hi ${user.name}, We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset code (valid for 10 min)",
        message,
      });
    } catch (err) {
      await User.updateOne(
        { _id: user._id },
        {
          passwordResetCode: null,
          passwordResetExpires: null,
          passwordResetVerified: null,
        }
      );

      return next(new ApiError("There is an error in sending email", 500));
    }

    res
      .status(200)
      .json({ status: "Success", message: "Reset code sent to email" });
  }
);

export const verifyResetCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetCode } = req.body;

    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError("Reset code invalid or expired", 400));
    }

    await User.updateOne(
      { _id: user._id },
      {
        passwordResetVerified: true,
      }
    );

    res.status(200).json({ status: "Success" });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ApiError(`There is no user with that email ${email}`, 404)
      );
    }

    if (!user.passwordResetVerified) {
      return next(new ApiError("Reset code not verified", 400));
    }

    await User.updateOne(
      { _id: user._id },
      {
        password: await bcrypt.hash(newPassword, 12),
        passwordChangedAt: Date.now(),
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetVerified: null,
      }
    );

    const token = createToken(user._id as string);

    res.status(200).json({ token });
  }
);
