import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import factory from "./handlersFactory";
import { uploadMixOfImages } from "../middlewares/uploadImageMiddleware";
import Product from "../models/productModel";

export const uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const resizeProductImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let files = { imageCover: [{ buffer: "" }], images: [], ...req.files };

    if (files.imageCover.length && files.imageCover[0].buffer) {
      const imageCoverFileName = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;

      await sharp(files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      req.body.imageCover = imageCoverFileName;
    }

    if (files.images.length) {
      req.body.images = [];
      await Promise.all(
        files.images.map(async (img: Express.Multer.File, index: number) => {
          const imageFileName = `products-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;

          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageFileName}`);
          req.body.images.push(imageFileName);
        })
      );
    }

    next();
  }
);

export const getProducts = factory.getAll(Product, "Products");

export const getProduct = factory.getOne(Product);

export const createProduct = factory.createOne(Product);

export const updateProduct = factory.updateOne(Product);

export const deleteProduct = factory.deleteOne(Product);
