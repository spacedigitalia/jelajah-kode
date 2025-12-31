import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/utils/context/AuthContext";

import { generateProjectId } from "@/hooks/TextFormatter";

import { parseIDR } from "@/hooks/FormatPrice";

export function useStateCreateProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const productId = searchParams.get("id");
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [formData, setFormData] = useState<CreateFormData>({
    title: "",
    productsId: "",
    thumbnail: "",
    description: "",
    faqs: "",
    price: 0,
    stock: 0,
    download: "",
    category: "",
    frameworks: [],
    tags: [],
    paymentType: "paid",
    status: "draft",
    images: [],
    discount: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

  // Auto-generate productsId from title
  useEffect(() => {
    if (formData.title && !isEdit) {
      const generatedId = generateProjectId(formData.title);
      setFormData((prev) => ({
        ...prev,
        productsId: generatedId,
      }));
    }
  }, [formData.title, isEdit]);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const [categoriesRes, frameworksRes, tagsRes] = await Promise.all([
          fetch("/api/products/categories", {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
            },
          }),
          fetch("/api/products/framework", {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
            },
          }),
          fetch("/api/products/tags", {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
            },
          }),
        ]);

        if (categoriesRes.ok) {
          const categoriesData: Category[] = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (frameworksRes.ok) {
          const frameworksData: Framework[] = await frameworksRes.json();
          setFrameworks(frameworksData);
        }

        if (tagsRes.ok) {
          const tagsData: Tag[] = await tagsRes.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        toast.error("Failed to load categories, frameworks, and tags");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // For new product creation, just set page loading to false
  useEffect(() => {
    if (!isEdit) {
      setIsPageLoading(false);
    } else {
      // Redirect if somehow this page is accessed in edit mode
      router.push("/dashboard/products/products/edit");
    }
  }, [isEdit, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsImageUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.url],
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsImageUploading(false);
      setUploadProgress(0);
      // Reset the file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsThumbnailUploading(true);
    setThumbnailUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const interval = setInterval(() => {
        setThumbnailUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setThumbnailUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload thumbnail");
      }

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        thumbnail: result.url,
      }));

      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload thumbnail"
      );
    } finally {
      setIsThumbnailUploading(false);
      setThumbnailUploadProgress(0);
      // Reset the file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? parseIDR(value)
          : name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // If empty, set to 0
    if (value === "" || value === ".") {
      setFormData((prev) => ({
        ...prev,
        price: 0,
      }));
      return;
    }

    // Remove all non-digit characters except dots (for formatting)
    // But we'll parse it to get the actual number
    const cleaned = value.replace(/[^\d]/g, "");

    // Parse to number
    const numericValue = cleaned === "" ? 0 : Number(cleaned);

    // Update formData with numeric value
    setFormData((prev) => ({
      ...prev,
      price: numericValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new product
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .map((tagId) => {
              const tag = tags.find((t) => t._id === tagId);
              return tag
                ? {
                    title: tag.title,
                    tagsId: tag.tagsId,
                  }
                : null;
            })
            .filter((tag) => tag !== null),
          category: formData.category
            ? [
                {
                  title:
                    categories.find((cat) => cat._id === formData.category)
                      ?.title || "",
                  categoryId: formData.category,
                },
              ]
            : [],
          frameworks:
            formData.frameworks.length > 0
              ? frameworks.filter((fw) => formData.frameworks.includes(fw._id))
              : [],
          discount:
            formData.discount?.type && formData.discount?.value
              ? {
                  type: formData.discount.type,
                  value: formData.discount.value,
                  until: formData.discount.until || undefined,
                }
              : undefined,
          images: formData.images ? formData.images : [],
          author: user
            ? {
                _id: user._id,
                name: user.name,
                picture: user.picture,
                role: user.role,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      const newProduct = await response.json();
      toast.success("Product created successfully!");
      router.push(`/dashboard/products/products/${newProduct._id}`);
    } catch (error) {
      console.error("Error processing product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    categories,
    frameworks,
    tags,
    loading,
    isPageLoading,
    formData,
    setFormData,
    isSubmitting,
    isImageUploading,
    isThumbnailUploading,
    uploadProgress,
    thumbnailUploadProgress,
    user,
    // Handlers
    handleFileUpload,
    handleThumbnailUpload,
    handleChange,
    handlePriceChange,
    handleSubmit,
  };
}
