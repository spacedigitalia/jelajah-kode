"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

export default function useStateProductsType() {
  const [types, setTypes] = useState<Type[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<Type | null>(null);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [formData, setFormData] = useState<TypeFormDataState>({
    title: "",
    typeId: "",
  });

  const fetchTypes = async () => {
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.products.type, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch types");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTypes(data);
      } else {
        console.error("Expected array of types but got:", data);
        setTypes([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching types:", error);
      setTypes([]);
      toast.error("Failed to fetch types");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", typeId: "" });
    setEditingType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = API_CONFIG.ENDPOINTS.products.type;
      const method = editingType ? "PUT" : "POST";
      const body = editingType
        ? {
            id: editingType._id,
            title: formData.title,
            typeId: formData.typeId,
          }
        : { title: formData.title, typeId: formData.typeId };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save type");

      toast.success(`Type ${editingType ? "updated" : "created"} successfully`);
      setIsDialogOpen(false);
      fetchTypes();
      resetForm();
    } catch (error) {
      console.error(
        `Error ${editingType ? "updating" : "creating"} type:`,
        error
      );
      toast.error(`Failed to ${editingType ? "update" : "create"} type`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.products.type, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: typeToDelete._id }),
      });

      if (!response.ok) throw new Error("Failed to delete type");

      toast.success("Type deleted successfully");
      fetchTypes();
      setIsDeleteDialogOpen(false);
      setTypeToDelete(null);
    } catch (error) {
      console.error("Error deleting type:", error);
      toast.error("Failed to delete type");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (type: Type) => {
    setEditingType(type);
    setFormData({
      title: type.title,
      typeId: type.typeId,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (type: Type) => {
    setTypeToDelete(type);
    setIsDeleteDialogOpen(true);
  };

  return {
    // data
    types,
    formData,
    editingType,
    typeToDelete,
    // loading state
    isLoading,
    isSubmitting,
    isDeleting,
    // modal state
    isDialogOpen,
    isDeleteDialogOpen,
    // pagination placeholders (none for types yet)
    // setters
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setFormData,
    setTypeToDelete,
    setEditingType,
    // handlers
    fetchTypes,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleDeleteClick,
    resetForm,
  };
}
