import TagsModel from "@/models/Tags";

import { connectMongoDB } from "@/lib/mongodb";

import { generateFrameworkId } from "@/hooks/TextFormatter";

export async function createTag(data: { title: string; tagsId?: string }) {
  try {
    await connectMongoDB();
    // Create tag with the provided tagsId or generate from title
    const tagsId = data.tagsId || generateFrameworkId(data.title);
    const tag = await TagsModel.create({
      title: data.title,
      tagsId: tagsId,
    });
    return tag;
  } catch (error) {
    throw error;
  }
}

// Get all tags
export async function getAllTags() {
  try {
    await connectMongoDB();
    const tags = await TagsModel.find().sort({ createdAt: -1 }).lean();
    return tags;
  } catch (error) {
    throw error;
  }
}

// Get a single tag by ID
export async function getTagById(id: string) {
  try {
    await connectMongoDB();
    const tag = await TagsModel.findById(id);
    return tag;
  } catch (error) {
    throw error;
  }
}

// Update a tag
export async function updateTag(
  id: string,
  data: { title: string; tagsId?: string }
) {
  try {
    await connectMongoDB();
    // Generate tagsId from title if not provided
    const tagsId = data.tagsId || generateFrameworkId(data.title);
    const tag = await TagsModel.findByIdAndUpdate(
      id,
      { title: data.title, tagsId: tagsId, updatedAt: new Date() },
      { new: true }
    );
    return tag;
  } catch (error) {
    throw error;
  }
}

// Delete a tag
export async function deleteTag(id: string) {
  try {
    await connectMongoDB();
    const tag = await TagsModel.findByIdAndDelete(id);
    return tag;
  } catch (error) {
    throw error;
  }
}

// Get only tag names
export async function getTagNames() {
  try {
    await connectMongoDB();
    const tags = await TagsModel.find().select("title -_id");
    return tags.map((tag) => tag.title);
  } catch (error) {
    throw error;
  }
}
