import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";

import validatorMiddleWare from "../../middlewares/validatorMiddleware";
import User from "../../models/userModel";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  validatorMiddleWare,
];

export const createUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((email) => {
        if (email) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }

      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EG and SA phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),

  validatorMiddleWare,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((email) => {
        if (email) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EG and SA phone numbers"),

  check("profileImg").optional(),

  check("role").optional(),

  validatorMiddleWare,
];

export const updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((email) => {
        if (email) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EG and SA phone numbers"),

  validatorMiddleWare,
];

export const changeUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),

  check("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params?.id);

      if (!user) {
        throw new Error("There is no user for this id");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.bodycurrentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }

      return true;
    }),

  validatorMiddleWare,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  validatorMiddleWare,
];
