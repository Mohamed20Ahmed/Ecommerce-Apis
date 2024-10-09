"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// 1- create schema
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "category name required"],
        unique: true,
        minLength: [3, "too short category name"],
        maxLength: [32, "too long category name"],
    },
    slug: { type: String, lowercase: true },
    image: String,
}, { timestamps: true });
const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
};
// findOne, findAll, update
categorySchema.post("init", (doc) => {
    setImageURL(doc);
});
// create
categorySchema.post("save", (doc) => {
    setImageURL(doc);
});
// 2- create model
const CategoreyModel = (0, mongoose_1.model)("Category", categorySchema);
exports.default = CategoreyModel;
