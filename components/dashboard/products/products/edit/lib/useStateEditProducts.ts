import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/utils/context/AuthContext";

import { parseIDR } from "@/hooks/FormatPrice";

import { API_CONFIG } from "@/lib/config";

export function useStateEditProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const productId = searchParams.get("id");

  const [categories, setCategories] = useState<Category[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [formData, setFormData] = useState<EditFormData>({
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

  // Combined effect for validation and data fetching
  useEffect(() => {
    if (!productId) {
      router.push("/dashboard/products/products");
      return;
    }

    const fetchCollectionsAndProduct = async () => {
      try {
        // Fetch collections first
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

        let categoriesData: Category[] = [];
        let frameworksData: Framework[] = [];
        let tagsData: Tag[] = [];
        let typesData: Type[] = [];

        if (categoriesRes.ok) {
          categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (frameworksRes.ok) {
          frameworksData = await frameworksRes.json();
          setFrameworks(frameworksData);
        }

        if (tagsRes.ok) {
          tagsData = await tagsRes.json();
          setTags(tagsData);
        }

        if (typesRes.ok) {
          typesData = await typesRes.json();
          setTypes(typesData);
        }

        // Then fetch product data
        const response = await fetch(
          API_CONFIG.ENDPOINTS.products.byId(productId),
          {
            headers: {
              Authorization: `Bearer ${API_CONFIG.SECRET}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const product: Products = await response.json();

        // Set form data with existing product data
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: product.title,
          productsId: product.productsId,
          thumbnail: product.thumbnail,
          description: product.description,
          faqs: product.faqs,
          price: product.price,
          stock: product.stock,
          download: product.download || "",
          category:
            product.category && product.category.length > 0
              ? (() => {
                  const categoryId = product.category[0].categoryId;
                  const foundCategory = categoriesData.find(
                    (cat) => cat.categoryId === categoryId
                  );
                  return foundCategory ? foundCategory._id : "";
                })()
              : "",
          type:
            product.type && product.type.length > 0
              ? (() => {
                  const typeId = product.type[0].typeId;
                  const foundType = typesData.find((t) => t.typeId === typeId);
                  return foundType ? foundType._id : "";
                })()
              : "",
          frameworks: product.frameworks
            ? (() => {
                const frameworkIds = product.frameworks.map(
                  (fw: Productsframeworks) => fw.frameworkId
                );
                return frameworksData
                  .filter((fw) => frameworkIds.includes(fw.frameworkId))
                  .map((fw) => fw._id);
              })()
            : [],
          paymentType: product.paymentType,
          status: product.status,
          tags: product.tags
            ? product.tags
                .map((tag: { title: string; tagsId: string } | string) => {
                  // Handle both object and string formats
                  const tagsId = typeof tag === "string" ? tag : tag.tagsId;
                  // Find tag _id by tagsId
                  const foundTag = tagsData.find((t) => t.tagsId === tagsId);
                  return foundTag ? foundTag._id : null;
                })
                .filter((id: string | null): id is string => id !== null)
            : [],
          images: product.images || [],
          discount: product.discount || undefined,
        }));
      } catch (error) {
        console.error("Error fetching collections or product:", error);
        toast.error("Failed to load product data");
        router.push("/dashboard/products/products");
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };

    fetchCollectionsAndProduct();
  }, [productId, router]);

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

    if (!productId) {
      toast.error("Product ID is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Update existing product
      const response = await fetch(
        API_CONFIG.ENDPOINTS.products.byId(productId),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_CONFIG.SECRET}`,
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
                    categoryId:
                      categories.find((cat) => cat._id === formData.category)
                        ?.categoryId || "",
                  },
                ]
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      await response.json();
      toast.success("Product updated successfully!");
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
    productId,
    // Handlers
    handleFileUpload,
    handleThumbnailUpload,
    handleChange,
    handlePriceChange,
    handleSubmit,
  };
}
