import mongoose from "mongoose";

const productsFrameworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    frameworkId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productsCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productsTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    typeId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productsTagsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tagsId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const discountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    until: {
      type: String,
    },
  },
  { _id: false }
);

const authorSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    productsId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    frameworks: {
      type: [productsFrameworkSchema],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    faqs: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          // If paymentType is "free", price must be 0
          if (this.paymentType === "free") {
            return value === 0;
          }
          // If paymentType is "paid", price must be greater than 0
          if (this.paymentType === "paid") {
            return value > 0;
          }
          return true;
        },
        message:
          "Price must be 0 when paymentType is 'free', and must be greater than 0 when paymentType is 'paid'",
      },
    },
    stock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
    },
    download: {
      type: String,
      default: "",
    },
    category: {
      type: [productsCategorySchema],
      default: [],
    },
    type: {
      type: [productsTypeSchema],
      default: [],
    },
    rating: {
      type: Number,
    },
    views: {
      type: Number,
    },
    ratingCount: {
      type: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    discount: {
      type: discountSchema,
    },
    author: {
      type: authorSchema,
      required: true,
    },
    tags: {
      type: [productsTagsSchema],
      default: [],
    },
    paymentType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    status: {
      type: String,
      enum: ["publish", "draft"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to ensure price is 0 when paymentType is "free"
productsSchema.pre("save", function (next) {
  // If paymentType is "free", ensure price is 0
  if (this.paymentType === "free") {
    this.price = 0;
  }
  next();
});

// Add pre-validate middleware to ensure data consistency
productsSchema.pre("validate", function (next) {
  // If paymentType is "free", ensure price is 0
  if (this.paymentType === "free" && this.price !== 0) {
    this.price = 0;
  }
  next();
});

// Prevent OverwriteModelError by checking if model already exists
const modelName = process.env.NEXT_PUBLIC_PRODUCTS as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Products: any =
  mongoose.models[modelName] || mongoose.model(modelName, productsSchema);
export default Products;
