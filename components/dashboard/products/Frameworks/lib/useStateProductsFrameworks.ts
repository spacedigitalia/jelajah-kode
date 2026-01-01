import { useEffect, useRef, useState } from "react";

import type React from "react";

import { toast } from "sonner";

import { generateFrameworkId } from "@/hooks/TextFormatter";
import { API_CONFIG } from "@/lib/config";

export default function useStateFrameworks() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<Framework>({
    thumbnail: "",
    title: "",
    _id: "",
    frameworkId: "",
    createdAt: "",
    updatedAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // View mode state
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter frameworks based on search term
  const filteredFrameworks = frameworks.filter(
    (framework) =>
      framework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      framework.frameworkId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFrameworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFrameworks = filteredFrameworks.slice(startIndex, endIndex);

  useEffect(() => {
    void fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_CONFIG.ENDPOINTS.products.framework, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      });
      const data = await response.json();
      setFrameworks(data);
    } catch {
      toast.error("Failed to fetch frameworks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleMultipleFileUpload(files);
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        setUploadProgress((prev) => [
          ...prev,
          { fileName: file.name, progress: 0, status: "uploading" },
        ]);

        const form = new FormData();
        form.append("file", file);

        const response = await fetch(
          API_CONFIG.ENDPOINTS.products.frameworkUpload,
          {
            method: "POST",
            body: form,
          }
        );
        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();

        const fileName = file.name.split(".")[0];
        const formattedTitle = fileName
          .split(/[-_]/)
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        setPendingUploads((prev) => [
          ...prev,
          { file, imageUrl: data.url, title: formattedTitle },
        ]);

        setUploadProgress((prev) =>
          prev.map((item) =>
            item.fileName === file.name
              ? { ...item, progress: 100, status: "success" }
              : item
          )
        );

        return data;
      } catch (error) {
        setUploadProgress((prev) =>
          prev.map((item) =>
            item.fileName === file.name ? { ...item, status: "error" } : item
          )
        );
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(
        "Files uploaded successfully. Click Create to save to database."
      );
    } catch {
      toast.error("Some files failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      if (isEditing) {
        const response = await fetch(
          API_CONFIG.ENDPOINTS.products.frameworkById(formData._id),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              thumbnail: pendingUploads[0].imageUrl,
              title: pendingUploads[0].title,
              frameworkId: generateFrameworkId(pendingUploads[0].title),
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update framework");
        toast.success("Framework updated successfully");
      } else {
        const savePromises = pendingUploads.map(async (upload) => {
          const response = await fetch(
            API_CONFIG.ENDPOINTS.products.framework,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                thumbnail: upload.imageUrl,
                title: upload.title,
                frameworkId: generateFrameworkId(upload.title),
              }),
            }
          );
          if (!response.ok) throw new Error("Failed to save framework");
          return response.json();
        });
        await Promise.all(savePromises);
        toast.success("All frameworks created successfully");
      }

      setIsEditing(false);
      setIsDialogOpen(false);
      setFormData({
        thumbnail: "",
        title: "",
        _id: "",
        frameworkId: "",
        createdAt: "",
        updatedAt: "",
      });
      setPendingUploads([]);
      setUploadProgress([]);
      void fetchFrameworks();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save frameworks"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        API_CONFIG.ENDPOINTS.products.frameworkById(id),
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete framework");
      toast.success("Framework deleted successfully");
      void fetchFrameworks();
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete framework");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (data: Framework) => {
    setFormData(data);
    setPendingUploads([
      {
        file: new File([], data.title),
        imageUrl: data.thumbnail,
        title: data.title,
      },
    ]);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    // state
    frameworks,
    isEditing,
    isUploading,
    isDialogOpen,
    isDeleteDialogOpen,
    deleteId,
    fileInputRef,
    formData,
    isLoading,
    isDeleting,
    isSubmitting,
    currentPage,
    itemsPerPage,
    pendingUploads,
    uploadProgress,
    isDragging,
    dropZoneRef,
    totalPages,
    startIndex,
    endIndex,
    currentFrameworks,
    viewMode,
    searchTerm,

    // setters
    setIsEditing,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setDeleteId,
    setFormData,
    setCurrentPage,
    setPendingUploads,
    setUploadProgress,
    setViewMode,
    setSearchTerm,

    // handlers
    fetchFrameworks,
    handleSearchChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleMultipleFileUpload,
    handleSubmit,
    handleDelete,
    handleEdit,
    openDeleteDialog,
  };
}
