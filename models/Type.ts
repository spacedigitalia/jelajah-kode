import mongoose from "mongoose";

interface TypeDocument extends mongoose.Document {
  title: string;
  typeId: string;
  createdAt: Date;
  updatedAt: Date;
}

const typeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    typeId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const TypeModel = mongoose.models.Type
  ? mongoose.model<TypeDocument>("Type")
  : mongoose.model<TypeDocument>("Type", typeSchema);

export const Type = TypeModel;
