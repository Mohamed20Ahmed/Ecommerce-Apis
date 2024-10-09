import { Schema, model, Document, Types } from "mongoose";

interface ISubCategory extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
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
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = model<ISubCategory>("SubCategory", subCategorySchema);

export default SubCategoryModel;
