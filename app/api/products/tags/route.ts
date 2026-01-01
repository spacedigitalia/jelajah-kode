import { NextResponse } from "next/server";

import {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
} from "@/services/tagService";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tags = await getAllTags();

    if (!Array.isArray(tags)) {
      return NextResponse.json([], { status: 500 });
    }

    const formattedTags = tags.map((tag) => ({
      _id: tag._id.toString(),
      title: tag.title,
      tagsId: tag.tagsId,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));
    return NextResponse.json(formattedTags);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST create new tag
export async function POST(request: Request) {
  try {
    const { title, tagsId } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const tag = await createTag({ title: title, tagsId });
    const formattedTag = {
      _id: tag._id.toString(),
      title: tag.title,
      tagsId: tag.tagsId,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
    return NextResponse.json(formattedTag, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

// PUT update tag
export async function PUT(request: Request) {
  try {
    const { id, title, tagsId } = await request.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    const tag = await updateTag(id, { title, tagsId });
    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    const formattedTag = {
      _id: tag._id.toString(),
      title: tag.title,
      tagsId: tag.tagsId,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
    return NextResponse.json(formattedTag);
  } catch {
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE tag
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedTag = await deleteTag(id);
    if (!deletedTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
