"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "product title is required"],
        minLength: [3, "Too short product title"],
        maxLength: [100, "Too long product title"],
    },
    slug: { type: String, required: true, lowercase: true },
    description: {
        type: String,
        required: [true, "product description is required"],
        minLength: [20, "Too short product description"],
    },
    quantity: {
        type: Number,
        required: [true, "product quantity is required"],
    },
    sold: { type: Number, default: 0 },
    price: {
        type: Number,
        required: [true, "product quantity is required"],
        trim: true,
        max: [200000, "Too long product price"],
    },
    priceAfterDiscount: { type: Number },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, "product image cover is required"],
    },
    images: [String],
    category: {
        type: mongoose_1.Schema.ObjectId,
        ref: "Category",
        required: [true, "Product must be belong to category"],
    },
    subCategories: [
        {
            type: mongoose_1.Schema.ObjectId,
            ref: "SubCategory",
        },
    ],
    brand: {
        type: mongoose_1.Schema.ObjectId,
        ref: "Brand",
    },
    ratingsAverage: {
        type: Number,
        min: [1, "Rating must be above or equal 1.0"],
        max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: { type: Number, default: 0 },
}, { timestamps: true });
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
        select: "name",
    });
    next();
});
const setImageURL = (doc) => {
    if (doc.imageCover) {
        const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageCoverUrl;
    }
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        doc.images = imagesList;
    }
};
productSchema.post("init", (doc) => {
    setImageURL(doc);
});
productSchema.post("save", (doc) => {
    setImageURL(doc);
});
const ProductModel = (0, mongoose_1.model)("Product", productSchema);
exports.default = ProductModel;
