"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductValidator = exports.updateProductValidator = exports.createProductValidator = exports.getProductValidator = void 0;
const express_validator_1 = require("express-validator");
const slugify_1 = __importDefault(require("slugify"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const categoryModel_1 = __importDefault(require("../../models/categoryModel"));
const subCategoryModel_1 = __importDefault(require("../../models/subCategoryModel"));
function checkSubCategoriesInDB() {
    return (subCategoriesIds) => subCategoryModel_1.default.find({
        _id: { $exists: true, $in: subCategoriesIds },
    }).then((subCategories) => {
        if (subCategories.length !== subCategoriesIds.length) {
            return Promise.reject(new Error("Invalid subCategories ids"));
        }
    });
}
function checkCategoryInDB() {
    return (categoryId) => categoryModel_1.default.findById(categoryId).then((category) => {
        if (!category) {
            return Promise.reject(new Error(`No category for this id ${categoryId}`));
        }
    });
}
function checkSubCategoriesBelongToCategory() {
    return (subCategoriesIds, { req }) => subCategoryModel_1.default.find({
        category: req.body.category,
        _id: { $exists: true, $in: subCategoriesIds },
    }).then((subCategories) => {
        console.log(subCategories);
        if (subCategories.length !== subCategoriesIds.length) {
            return Promise.reject(new Error("SubCategories not be belong to category"));
        }
    });
}
exports.getProductValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid product id format"),
    validatorMiddleware_1.default,
];
exports.createProductValidator = [
    (0, express_validator_1.check)("title")
        .notEmpty()
        .withMessage("product title is required")
        .isLength({ min: 3 })
        .withMessage("Too short product title")
        .isLength({ max: 100 })
        .withMessage("Too long product title")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    (0, express_validator_1.check)("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ min: 20 })
        .withMessage("Too short product description"),
    (0, express_validator_1.check)("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    (0, express_validator_1.check)("sold")
        .optional()
        .isNumeric()
        .withMessage("Product sold must be a number"),
    (0, express_validator_1.check)("price")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product price must be a number"),
    (0, express_validator_1.check)("priceAfterDiscount")
        .optional()
        .toFloat()
        .isNumeric()
        .withMessage("Product priceAfterDiscount must be a number")
        .custom((value, { req }) => {
        if (req.body.price <= value) {
            throw new Error("priceAfterDiscount must be lower than price");
        }
        return true;
    }),
    (0, express_validator_1.check)("colors")
        .optional()
        .isArray()
        .withMessage("product colors should be array of string"),
    (0, express_validator_1.check)("imageCover").notEmpty().withMessage("Product imageCover is required"),
    (0, express_validator_1.check)("images")
        .optional()
        .isArray()
        .withMessage("product images should be array of string"),
    (0, express_validator_1.check)("category")
        .notEmpty()
        .withMessage("Product must be belong to category")
        .isMongoId()
        .withMessage("Invalid category id format")
        .custom(checkCategoryInDB()),
    (0, express_validator_1.check)("subCategories")
        .optional()
        .isMongoId()
        .withMessage("Invalid subCategories ids format")
        .custom(checkSubCategoriesInDB())
        .custom(checkSubCategoriesBelongToCategory()),
    (0, express_validator_1.check)("brand").optional().isMongoId().withMessage("Invalid brand id format"),
    (0, express_validator_1.check)("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("ratingsAverage must be a number")
        .isLength({ min: 1 })
        .withMessage("Rating must be above or equal 1.0")
        .isLength({ max: 5 })
        .withMessage("Rating must be below or equal 5.0"),
    (0, express_validator_1.check)("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("ratingsQuantity must be a number"),
    validatorMiddleware_1.default,
];
exports.updateProductValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid product id format"),
    (0, express_validator_1.check)("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short product title")
        .isLength({ max: 100 })
        .withMessage("Too long product title")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.deleteProductValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid product id format"),
    validatorMiddleware_1.default,
];
