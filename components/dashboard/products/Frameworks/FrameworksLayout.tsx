"use client"

import { Button } from '@/components/ui/button'

import { ChevronRight } from "lucide-react"

import Image from 'next/image'

import { Skeleton } from '@/components/ui/skeleton'

import FormModalFramework from '@/components/dashboard/products/Frameworks/modal/FormModalProductsFrameworks'

import DeleteModalFramework from '@/components/dashboard/products/Frameworks/modal/DeleteModalProductsFrameworks'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'

import useStateFrameworks from '@/components/dashboard/products/Frameworks/lib/useStateProductsFrameworks'

export default function FrameworkLayout() {
  const {
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
    pendingUploads,
    uploadProgress,
    isDragging,
    dropZoneRef,
    totalPages,
    currentFrameworks,
    setIsEditing,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setDeleteId,
    setCurrentPage,
    setPendingUploads,
    setUploadProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleMultipleFileUpload,
    handleSubmit,
    handleDelete,
    handleEdit,
    openDeleteDialog,
  } = useStateFrameworks();

  return (
    <section className="p-4 sm:p-8 bg-muted/30 rounded-2xl">
      <div className='flex flex-col gap-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex flex-col gap-4'>
              <h3 className='text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent'>
                Framework
              </h3>

              <ol className='flex flex-wrap gap-2 items-center text-sm text-muted-foreground'>
                <li className='flex items-center hover:text-primary transition-colors'>
                  <span>Dashboard</span>
                  <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                </li>
                <li className='flex items-center text-primary font-medium'>
                  <span>Framework</span>
                </li>
              </ol>
            </div>

            <Button
              variant="default"
              className="px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90"
              onClick={() => {
                setIsEditing(false);
                setIsDialogOpen(true);
              }}
            >
              Create Content
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 sm:p-6 border rounded-xl bg-card shadow-sm">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <div className="flex-1">
                    <div className="flex flex-col justify-between items-start gap-4">
                      <div className="space-y-3 w-full">
                        <Skeleton className="h-7 w-40" />
                      </div>
                      <div className="flex gap-3 w-full">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : frameworks.length === 0 ? (
            <div className="col-span-full p-8 text-center border rounded-xl bg-card shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-16 h-16 text-muted-foreground/50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Frameworks Found</h3>
                <p className="text-muted-foreground">Start by creating your first framework using the &quot;Create Content&quot; button above.</p>
              </div>
            </div>
          ) : (
            currentFrameworks.map((framework) => (
              <div key={framework._id} className="p-4 sm:p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="relative w-full aspect-4/3 shrink-0">
                    {framework.thumbnail ? (
                      <Image
                        src={framework.thumbnail}
                        alt={framework.title}
                        fill
                        className="object-cover rounded-xl shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col justify-between items-start gap-4">
                      <div className="space-y-2 w-full">
                        <h4 className="text-lg sm:text-xl font-bold">{framework.title}</h4>
                      </div>
                      <div className="flex gap-3 w-full">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            handleEdit(framework);
                            setIsDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={() => framework._id && openDeleteDialog(framework._id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Section */}
        {!isLoading && frameworks.length > 0 && (
          <div className="flex justify-center pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink isActive={true}>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <FormModalFramework
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        dropZoneRef={dropZoneRef}
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        pendingUploads={pendingUploads}
        setPendingUploads={setPendingUploads}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        isSubmitting={isSubmitting}
        handleMultipleFileUpload={handleMultipleFileUpload}
      />

      <DeleteModalFramework
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onCancel={() => { setIsDeleteDialogOpen(false); setDeleteId(null); }}
        onConfirm={() => { if (deleteId) handleDelete(deleteId); }}
        isDeleting={isDeleting}
      />
    </section>
  )
}