"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "brand name required"],
        unique: true,
        minLength: [2, "too short brand name"],
        maxLength: [32, "too long brand name"],
    },
    slug: { type: String, lowerCase: true },
    image: String,
}, { timestamps: true });
const setImageURL = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};
brandSchema.post("init", (doc) => {
    setImageURL(doc);
});
brandSchema.post("save", (doc) => {
    setImageURL(doc);
});
const BrandModel = (0, mongoose_1.model)("Brand", brandSchema);
exports.default = BrandModel;
