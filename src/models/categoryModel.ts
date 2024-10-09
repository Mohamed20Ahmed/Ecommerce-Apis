import { Schema, model, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
}

// 1- create schema
const categorySchema = new Schema<ICategory>(
  {
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
  },
  { timestamps: true }
);

const setImageURL = (doc: ICategory): void => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll, update
categorySchema.post<ICategory>("init", (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post<ICategory>("save", (doc) => {
  setImageURL(doc);
});

// 2- create model
const CategoreyModel = model<ICategory>("Category", categorySchema);

export default CategoreyModel;
