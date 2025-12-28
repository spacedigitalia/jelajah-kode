import { useEffect, useRef, useState } from "react";

import type React from "react";

import { toast } from "sonner";

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

  const totalPages = Math.ceil(frameworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFrameworks = frameworks.slice(startIndex, endIndex);

  useEffect(() => {
    void fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/frameworks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
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
    const uploadPromises = files.map(async (file) => {
      try {
        setUploadProgress((prev) => [
          ...prev,
          { fileName: file.name, progress: 0, status: "uploading" },
        ]);

        const form = new FormData();
        form.append("file", file);

        const response = await fetch("/api/frameworks/upload", {
          method: "POST",
          body: form,
        });
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      if (isEditing) {
        const response = await fetch(`/api/frameworks?id=${formData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thumbnail: pendingUploads[0].imageUrl,
            title: pendingUploads[0].title,
          }),
        });
        if (!response.ok) throw new Error("Failed to update framework");
        toast.success("Framework updated successfully");
      } else {
        const savePromises = pendingUploads.map(async (upload) => {
          const response = await fetch("/api/frameworks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              thumbnail: upload.imageUrl,
              title: upload.title,
            }),
          });
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
      const response = await fetch(`/api/frameworks?id=${id}`, {
        method: "DELETE",
      });
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

    // setters
    setIsEditing,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setDeleteId,
    setFormData,
    setCurrentPage,
    setPendingUploads,
    setUploadProgress,

    // handlers
    fetchFrameworks,
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
