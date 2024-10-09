import { Schema, model, Document } from "mongoose";

interface IBrand extends Document {
  name: string;
  slug: string;
  image?: string;
}

const brandSchema = new Schema<IBrand>(
  {
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
  },
  { timestamps: true }
);

const setImageURL = (doc: IBrand): void => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post<IBrand>("init", (doc) => {
  setImageURL(doc);
});

brandSchema.post<IBrand>("save", (doc) => {
  setImageURL(doc);
});

const BrandModel = model<IBrand>("Brand", brandSchema);

export default BrandModel;
