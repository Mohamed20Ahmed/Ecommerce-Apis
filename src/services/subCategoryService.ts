import { Request, Response, NextFunction } from "express";

import SubCategory from "../models/subCategoryModel";
import factory from "./handlersFactory";

export const getSubCategories = factory.getAll(SubCategory);

export const getSubCategory = factory.getOne(SubCategory);

export const createSubCategory = factory.createOne(SubCategory);

export const updateSubCategory = factory.updateOne(SubCategory);

export const deleteSubCategory = factory.deleteOne(SubCategory);

interface CustomRequest extends Request {
  filterObj?: { [key: string]: any };
}

export const createFilterObj = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let filterObj = {};

  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
  }

  req.filterObj = filterObj;

  next();
};

export const setCategoryIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }

  next();
};
