import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Products from "@/models/Products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productsId: string }> }
) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productsId } = await params;

    if (!productsId || typeof productsId !== "string") {
      return NextResponse.json(
        { error: "Invalid productsId parameter" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find product by productsId
    const product = await Products.findOne({ productsId });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Format the product response to match the frontend interface
    const formattedProduct = {
      _id: product._id.toString(),
      title: product.title,
      productsId: product.productsId,
      thumbnail: product.thumbnail,
      frameworks: product.frameworks,
      description: product.description,
      faqs: product.faqs,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      download: product.download,
      category: product.category,
      rating: product.rating,
      views: product.views,
      ratingCount: product.ratingCount,
      images: product.images,
      discount: product.discount,
      author: product.author,
      tags: product.tags,
      paymentType: product.paymentType,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product by productsId:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
