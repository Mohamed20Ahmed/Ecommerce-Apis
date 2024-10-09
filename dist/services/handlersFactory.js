"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const getAll = (Model, modelName = "") => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    const documentsCounts = yield Model.countDocuments();
    const apiFeatures = new apiFeatures_1.default(Model.find(filter), req.query)
        .paginate(documentsCounts)
        .filter()
        .search(modelName)
        .limitFields()
        .sort();
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = yield mongooseQuery;
    res
        .status(200)
        .json({ results: documents.length, paginationResult, data: documents });
}));
const getOne = (Model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield Model.findById(req.params.id);
    if (!document) {
        return next(new apiError_1.default(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
}));
const createOne = (Model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield Model.create(req.body);
    res.status(201).json({ data: document });
}));
const updateOne = (Model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!document) {
        return next(new apiError_1.default(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
}));
const deleteOne = (Model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const document = yield Model.findByIdAndDelete(id);
    if (!document) {
        return next(new apiError_1.default(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
}));
const factory = { getAll, getOne, createOne, updateOne, deleteOne };
exports.default = factory;
