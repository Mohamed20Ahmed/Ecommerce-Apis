import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import factory from "./handlersFactory";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import Category from "../models/categoryModel";

export const uploadCategoryImage = uploadSingleImage("image");

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);

      req.body.image = filename;
    }

    next();
  }
);

export const getCategories = factory.getAll(Category);

export const getCategory = factory.getOne(Category);

export const createCategory = factory.createOne(Category);

export const updateCategory = factory.updateOne(Category);

export const deleteCategory = factory.deleteOne(Category);
