import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleWare from "../../middlewares/validatorMiddleware";

export const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  validatorMiddleWare,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];

export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleWare,
];

export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),

  validatorMiddleWare,
];
