"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCategoryIdToBody = exports.createFilterObj = exports.deleteSubCategory = exports.updateSubCategory = exports.createSubCategory = exports.getSubCategory = exports.getSubCategories = void 0;
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
const handlersFactory_1 = __importDefault(require("./handlersFactory"));
exports.getSubCategories = handlersFactory_1.default.getAll(subCategoryModel_1.default);
exports.getSubCategory = handlersFactory_1.default.getOne(subCategoryModel_1.default);
exports.createSubCategory = handlersFactory_1.default.createOne(subCategoryModel_1.default);
exports.updateSubCategory = handlersFactory_1.default.updateOne(subCategoryModel_1.default);
exports.deleteSubCategory = handlersFactory_1.default.deleteOne(subCategoryModel_1.default);
const createFilterObj = (req, res, next) => {
    let filterObj = {};
    if (req.params.categoryId) {
        filterObj = { category: req.params.categoryId };
    }
    req.filterObj = filterObj;
    next();
};
exports.createFilterObj = createFilterObj;
const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};
exports.setCategoryIdToBody = setCategoryIdToBody;
