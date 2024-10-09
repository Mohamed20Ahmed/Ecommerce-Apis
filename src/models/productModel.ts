import { Schema, model, Document, Types, Query } from "mongoose";

interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold?: number;
  price: number;
  priceAfterDiscount?: number;
  colors?: string[];
  imageCover: string;
  images?: string[];
  category: Types.ObjectId;
  subCategories?: Types.ObjectId[];
  brand?: Types.ObjectId;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

const productSchema = new Schema<IProduct>(
  {
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
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },

    subCategories: [
      {
        type: Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: Schema.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },

    ratingsQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre<Query<IProduct, IProduct>>(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });

  next();
});

const setImageURL = (doc: IProduct): void => {
  if (doc.imageCover) {
    const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }

  if (doc.images) {
    const imagesList: string[] = [];

    doc.images.forEach((image: string) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });

    doc.images = imagesList;
  }
};

productSchema.post<IProduct>("init", (doc) => {
  setImageURL(doc);
});

productSchema.post<IProduct>("save", (doc) => {
  setImageURL(doc);
});

const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
