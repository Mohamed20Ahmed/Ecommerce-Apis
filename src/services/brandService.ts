import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import factory from "./handlersFactory";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";
import Brand from "../models/brandModel";

export const uploadBrandImage = uploadSingleImage("image");

export const resizeImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

      sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${filename}`);

      req.body.image = filename;
    }

    next();
  }
);

export const getBrands = factory.getAll(Brand);

export const getBrand = factory.getOne(Brand);

export const createBrand = factory.createOne(Brand);

export const updateBrand = factory.updateOne(Brand);

export const deleteBrand = factory.deleteOne(Brand);
