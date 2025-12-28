import mongoose from "mongoose";

const frameworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  frameworkId: {
    type: String,
    required: true, // Now required since it's generated from title
    trim: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
frameworkSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const modelName = process.env.NEXT_PUBLIC_FRAMEWORKS as string;

const Frameworks =
  mongoose.models[modelName] || mongoose.model(modelName, frameworkSchema);
export default Frameworks;
