"use client";

import { Button } from "@/components/ui/button";

import { ChevronRight, Pencil, Trash2, Plus, FolderPlus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useStateProductsType from "@/components/dashboard/products/Type/lib/useStateProductsType";

import FormModalProductsType from "@/components/dashboard/products/Type/modal/FormModalProductsType";

import DeleteModalProductsType from "@/components/dashboard/products/Type/modal/DeleteModalProductsType";

import useFormatDate from "@/hooks/FormatDate";

export default function TypeLayout() {
  const {
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
    // setters
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setFormData,
    setTypeToDelete,
    setEditingType,
    // handlers
    handleSubmit,
    handleDelete,
    handleEdit,
    handleDeleteClick,
    resetForm,
  } = useStateProductsType();

  const { formatDate, formatUpdatedAt } = useFormatDate();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center p-6 border rounded-2xl border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3">
          <h3 className="text-3xl font-bold">Types</h3>

          <ol className="flex gap-2 items-center text-sm text-muted-foreground">
            <li className="flex items-center hover:text-primary transition-colors">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
            </li>
            <li className="flex items-center text-primary font-medium">
              <span>Types</span>
            </li>
          </ol>
        </div>
        <Button
          variant="default"
          className="px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all"
          onClick={() => {
            setEditingType(null);
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Type
        </Button>
      </div>

      <div className="border rounded-2xl border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading types...</p>
          </div>
        ) : types.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <FolderPlus className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-semibold">No Types Found</h3>
                <p className="text-sm text-muted-foreground">
                  Types help you organize your content. Get started by
                  creating your first type.
                </p>
              </div>
              <Button
                variant="default"
                className="mt-4"
                onClick={() => {
                  setEditingType(null);
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Type
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type._id}>
                  <TableCell className="pl-4">{type.title}</TableCell>
                  <TableCell>{type.typeId}</TableCell>
                  <TableCell>{type.createdAt ? formatDate(type.createdAt) : "N/A"}</TableCell>
                  <TableCell>{type.updatedAt ? formatUpdatedAt(type.updatedAt) : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(type)}
                      disabled={isSubmitting || isDeleting}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(type)}
                      disabled={isSubmitting || isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <FormModalProductsType
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingType={editingType}
        formData={formData}
        setFormData={(v) => setFormData(v)}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      <DeleteModalProductsType
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setTypeToDelete(null);
        }}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemTitle={typeToDelete?.title}
      />
    </section>
  );
}
