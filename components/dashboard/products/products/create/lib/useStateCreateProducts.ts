import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/utils/context/AuthContext";

import { generateProjectId } from "@/hooks/TextFormatter";

import { parseIDR } from "@/hooks/FormatPrice";

import { API_CONFIG } from "@/lib/config";

export function useStateCreateProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const productId = searchParams.get("id");
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
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
    type: "",
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

  // Auto-set price to 0 when paymentType is "free"
  useEffect(() => {
    if (formData.paymentType === "free") {
      setFormData((prev) => ({
        ...prev,
        price: 0,
      }));
    }
  }, [formData.paymentType]);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const [categoriesRes, frameworksRes, tagsRes, typesRes] =
          await Promise.all([
            fetch(API_CONFIG.ENDPOINTS.products.categories, {
              headers: {
                Authorization: `Bearer ${API_CONFIG.SECRET}`,
              },
            }),
            fetch(API_CONFIG.ENDPOINTS.products.framework, {
              headers: {
                Authorization: `Bearer ${API_CONFIG.SECRET}`,
              },
            }),
            fetch(API_CONFIG.ENDPOINTS.products.tags, {
              headers: {
                Authorization: `Bearer ${API_CONFIG.SECRET}`,
              },
            }),
            fetch(API_CONFIG.ENDPOINTS.products.type, {
              headers: {
                Authorization: `Bearer ${API_CONFIG.SECRET}`,
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

        if (typesRes.ok) {
          const typesData: Type[] = await typesRes.json();
          setTypes(typesData);
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

      const response = await fetch(API_CONFIG.ENDPOINTS.products.upload, {
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

      const response = await fetch(API_CONFIG.ENDPOINTS.products.upload, {
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
      // Ensure price is 0 if paymentType is "free"
      const finalPrice = formData.paymentType === "free" ? 0 : formData.price;

      // Create new product
      const response = await fetch(API_CONFIG.ENDPOINTS.products.base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
        body: JSON.stringify({
          title: formData.title,
          productsId: formData.productsId,
          thumbnail: formData.thumbnail,
          description: formData.description,
          faqs: formData.faqs || "",
          price: finalPrice,
          stock: formData.stock,
          download: formData.download || "",
          paymentType: formData.paymentType,
          status: formData.status,
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
                  categoryId:
                    categories.find((cat) => cat._id === formData.category)
                      ?.categoryId || "",
                },
              ]
            : [],
          frameworks:
            formData.frameworks.length > 0
              ? frameworks
                  .filter((fw) => formData.frameworks.includes(fw._id))
                  .map((fw) => ({
                    title: fw.title,
                    frameworkId: fw.frameworkId,
                    thumbnail: fw.thumbnail,
                  }))
              : [],
          type: formData.type
            ? [
                {
                  title:
                    types.find((t) => t._id === formData.type)?.title || "",
                  typeId:
                    types.find((t) => t._id === formData.type)?.typeId || "",
                },
              ]
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
        // Show more detailed error message if available
        const errorMessage = errorData.details
          ? `${errorData.error}: ${
              Array.isArray(errorData.details)
                ? errorData.details.join(", ")
                : errorData.details
            }`
          : errorData.error || "Failed to create product";
        throw new Error(errorMessage);
      }

      toast.success("Product created successfully!");
      router.push(`/dashboard/products/products`);
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
    types,
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
