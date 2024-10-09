import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError";
import ApiFeatures from "../utils/apiFeatures";
import { Model } from "mongoose";

interface ModelType extends Model<any> {}

interface CustomRequest extends Request {
  filterObj?: { [key: string]: any };
}

const getAll = (Model: ModelType, modelName = "") =>
  asyncHandler(async (req: CustomRequest, res: Response) => {
    let filter: { [key: string]: any } = {};

    if (req.filterObj) {
      filter = req.filterObj;
    }

    const documentsCounts = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;

    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

const getOne = (Model: ModelType) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

const createOne = (Model: ModelType) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.create(req.body);

    res.status(201).json({ data: document });
  });

const updateOne = (Model: ModelType) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

const deleteOne = (Model: ModelType) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(204).send();
  });

const factory = { getAll, getOne, createOne, updateOne, deleteOne };

export default factory;
