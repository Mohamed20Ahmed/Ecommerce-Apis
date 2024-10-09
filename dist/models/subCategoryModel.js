"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "subCategory name required"],
        unique: true,
        minLength: [2, "too short subCategory name"],
        maxLength: [32, "too long subCategory name"],
    },
    slug: { type: String, lowercase: true },
    category: {
        type: mongoose_1.Schema.ObjectId,
        ref: "Category",
        required: [true, "subCategory must be belong to category"],
    },
}, { timestamps: true });
const SubCategoryModel = (0, mongoose_1.model)("SubCategory", subCategorySchema);
exports.default = SubCategoryModel;
