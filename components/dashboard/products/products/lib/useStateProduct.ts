"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useFormatDate from "@/hooks/FormatDate";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/config";

interface Product {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
  stock: number;
  sold?: number;
  category: Array<{
    title: string;
    categoryId: string;
  }>;
  type: Array<{
    title: string;
    typeId: string;
  }>;
  tags?: Array<{
    title: string;
    tagsId: string;
  }>;
  rating?: number;
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

export default function useStateProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [isViewModeInitialized, setIsViewModeInitialized] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const itemsPerPage = 10;

  const router = useRouter();

  const { formatDate } = useFormatDate();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.some(
        (cat) =>
          cat.categoryId === selectedCategory || cat.title === selectedCategory
      );

    // Type filter
    const matchesType =
      selectedType === "all" ||
      product.type.some(
        (type) => type.typeId === selectedType || type.title === selectedType
      );

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { title: string; categoryId: string }
    >();

    products.forEach((product) => {
      product.category?.forEach((cat) => {
        if (!categoryMap.has(cat.categoryId)) {
          categoryMap.set(cat.categoryId, {
            title: cat.title,
            categoryId: cat.categoryId,
          });
        }
      });
    });

    return Array.from(categoryMap.values());
  }, [products]);

  // Extract unique types from products
  const types = useMemo(() => {
    const typeMap = new Map<string, { title: string; typeId: string }>();

    products.forEach((product) => {
      product.type?.forEach((type) => {
        if (!typeMap.has(type.typeId)) {
          typeMap.set(type.typeId, {
            title: type.title,
            typeId: type.typeId,
          });
        }
      });
    });

    return Array.from(typeMap.values());
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Load viewMode from localStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("productsViewMode");
      if (savedViewMode === "card" || savedViewMode === "table") {
        setViewMode(savedViewMode);
      }
      setIsViewModeInitialized(true);
    }
  }, []);

  // Save viewMode to localStorage whenever it changes (only after initialization)
  useEffect(() => {
    if (typeof window !== "undefined" && isViewModeInitialized) {
      localStorage.setItem("productsViewMode", viewMode);
    }
  }, [viewMode, isViewModeInitialized]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_CONFIG.ENDPOINTS.products.base, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.data || data); // Handle both paginated and non-paginated responses
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const product = products.find((p) => p._id === id);
    setDeleteItemTitle(product?.title || null);
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        API_CONFIG.ENDPOINTS.products.byId(deleteId),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${API_CONFIG.SECRET}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteItemTitle(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return {
    // Data
    products,
    categories,
    types,
    currentProducts,
    filteredProducts,

    // Loading states
    isLoading,
    isSubmitting,

    // Modal states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Delete states
    deleteId,
    setDeleteId,
    deleteItemTitle,
    setDeleteItemTitle,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalPages,

    // Search and view states
    searchTerm,
    selectedCategory,
    selectedType,
    selectedStatus,
    viewMode,
    setViewMode,

    // Filter sheet state
    isFilterSheetOpen,
    setIsFilterSheetOpen,

    // Functions
    handleDelete,
    confirmDelete,
    handleSearchChange,
    handleCategoryChange,
    handleTypeChange,
    handleStatusChange,
    formatDate,
    router,
  };
}
