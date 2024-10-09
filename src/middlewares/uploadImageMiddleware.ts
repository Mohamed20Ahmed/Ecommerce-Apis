import { Request } from "express";
import multer, { Multer, FileFilterCallback } from "multer";

import ApiError from "../utils/apiError";

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400));
    }
  };

  const upload: Multer = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

export const uploadSingleImage = (fieldName: string) =>
  multerOptions().single(fieldName);

export const uploadMixOfImages = (
  arrayOfFields: { name: string; maxCount: number }[]
) => multerOptions().fields(arrayOfFields);
