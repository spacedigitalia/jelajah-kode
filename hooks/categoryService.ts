import { Category } from "@/models/Category";

import { connectMongoDB } from "@/lib/mongodb";

// Create a new category
export async function createCategory(data: {
  title: string;
  categoryId?: string;
}) {
  try {
    await connectMongoDB();
    // Create category with the provided categoryId or generate from title
    const categoryId =
      data.categoryId ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    const category = await Category.create({
      title: data.title,
      categoryId: categoryId,
    });
    return category;
  } catch (error) {
    throw error;
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    await connectMongoDB();
    console.log("Fetching categories...");
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    console.log("Categories fetched:", categories);
    return categories;
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    throw error;
  }
}

// Get a single category by ID
export async function getCategoryById(id: string) {
  try {
    await connectMongoDB();
    const category = await Category.findById(id);
    return category;
  } catch (error) {
    throw error;
  }
}

// Update a category
export async function updateCategory(
  id: string,
  data: { title: string; categoryId?: string }
) {
  try {
    await connectMongoDB();
    // Generate categoryId from title if not provided
    const categoryId =
      data.categoryId ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    const category = await Category.findByIdAndUpdate(
      id,
      { title: data.title, categoryId: categoryId, updatedAt: new Date() },
      { new: true }
    );
    return category;
  } catch (error) {
    throw error;
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  try {
    await connectMongoDB();
    const category = await Category.findByIdAndDelete(id);
    return category;
  } catch (error) {
    throw error;
  }
}

// Get only category names
export async function getCategoryNames() {
  try {
    await connectMongoDB();
    const categories = await Category.find().select("title -_id");
    return categories.map((category) => category.title);
  } catch (error) {
    throw error;
  }
}
