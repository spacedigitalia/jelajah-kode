"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

export default function useStateProjectsCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormDataState>({
    title: "",
    categoryId: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.products.categories, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Expected array of categories but got:", data);
        setCategories([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", categoryId: "" });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = API_CONFIG.ENDPOINTS.products.categories;
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory
        ? {
            id: editingCategory._id,
            title: formData.title,
            categoryId: formData.categoryId,
          }
        : { title: formData.title, categoryId: formData.categoryId };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save category");

      toast.success(
        `Category ${editingCategory ? "updated" : "created"} successfully`
      );
      setIsDialogOpen(false);
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error(
        `Error ${editingCategory ? "updating" : "creating"} category:`,
        error
      );
      toast.error(
        `Failed to ${editingCategory ? "update" : "create"} category`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.products.categories, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryToDelete._id }),
      });

      if (!response.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted successfully");
      fetchCategories();
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      categoryId: category.categoryId,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  return {
    // data
    categories,
    formData,
    editingCategory,
    categoryToDelete,
    // loading state
    isLoading,
    isSubmitting,
    isDeleting,
    // modal state
    isDialogOpen,
    isDeleteDialogOpen,
    // pagination placeholders (none for categories yet)
    // setters
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setFormData,
    setCategoryToDelete,
    setEditingCategory,
    // handlers
    fetchCategories,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleDeleteClick,
    resetForm,
  };
}
