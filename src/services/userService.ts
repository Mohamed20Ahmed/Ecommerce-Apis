import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import bcrypt from "bcrypt";

import factory from "./handlersFactory";
import ApiError from "../utils/apiError";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import createToken from "../utils/createToken";
import User from "../models/userModel";

export const uploadUserImage = uploadSingleImage("profileImg");

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/users/${filename}`);

      req.body.profileImg = filename;
    }

    next();
  }
);

export const getUsers = factory.getAll(User);

export const getUser = factory.getOne(User);

export const createUser = factory.createOne(User);

export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, phone, email, profileImg, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, slug, phone, email, profileImg, role },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`No user for this id ${req.params.id}`, 404));
    }

    res.status(200).json({ data: user });
  }
);

export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`No user for this id ${req.params.id}`, 404));
    }

    res.status(200).json({ data: user });
  }
);

export const deleteUser = factory.deleteOne(User);

interface CustomRequest extends Request {
  user?: { _id: any };
}

export const getLoggedUserData = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    req.params.id = req.user?._id;

    next();
  }
);

export const updateLoggedUserPassword = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    const token = createToken(user._id as string);

    res.status(200).json({ data: user, token });
  }
);

export const updateLoggedUserData = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ data: updatedUser });
  }
);

export const deleteLoggedUserData = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    await User.updateOne(
      { _id: req.user?._id },
      {
        active: false,
      }
    );

    res.status(204).json({ status: "Success" });
  }
);
