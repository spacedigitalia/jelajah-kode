import { Type } from "@/models/Type";

import { connectMongoDB } from "@/lib/mongodb";

import { generateFrameworkId } from "@/hooks/TextFormatter";

export async function createType(data: { title: string; typeId?: string }) {
  try {
    await connectMongoDB();
    // Create category with the provided categoryId or generate from title
    const typeId = data.typeId || generateFrameworkId(data.title);
    const type = await Type.create({
      title: data.title,
      typeId: typeId,
    });
    return type;
  } catch (error) {
    throw error;
  }
}

// Get all categories
export async function getAllTypes() {
  try {
    await connectMongoDB();
    const types = await Type.find().sort({ createdAt: -1 }).lean();
    return types;
  } catch (error) {
    throw error;
  }
}

// Get a single type by ID
export async function getTypeById(id: string) {
  try {
    await connectMongoDB();
    const type = await Type.findById(id);
    return type;
  } catch (error) {
    throw error;
  }
}

// Update a category
export async function updateType(
  id: string,
  data: { title: string; typeId?: string }
) {
  try {
    await connectMongoDB();
    // Generate categoryId from title if not provided
    const typeId = data.typeId || generateFrameworkId(data.title);
    const type = await Type.findByIdAndUpdate(
      id,
      { title: data.title, typeId: typeId, updatedAt: new Date() },
      { new: true }
    );
    return type;
  } catch (error) {
    throw error;
  }
}

// Delete a category
export async function deleteType(id: string) {
  try {
    await connectMongoDB();
    const type = await Type.findByIdAndDelete(id);
    return type;
  } catch (error) {
    throw error;
  }
}

// Get only type names
export async function getTypeNames() {
  try {
    await connectMongoDB();
    const types = await Type.find().select("title -_id");
    return types.map((type) => type.title);
  } catch (error) {
    throw error;
  }
}
