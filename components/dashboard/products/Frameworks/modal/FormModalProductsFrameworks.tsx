"use client"

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type React from 'react'

import { ChangeEvent } from 'react'

export default function FormModalFramework(props: FormModalProjectsFrameworksProps) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    handleSubmit,
    dropZoneRef,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    pendingUploads,
    setPendingUploads,
    uploadProgress,
    setUploadProgress,
    fileInputRef,
    isUploading,
    isSubmitting,
    handleMultipleFileUpload,
  } = props

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[600px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl font-bold">{isEditing ? 'Edit Framework' : 'Create Framework'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            <div
              ref={dropZoneRef as unknown as React.RefObject<HTMLDivElement>}
              className={`relative w-full aspect-4/3 border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {pendingUploads.length > 0 ? (
                <div className="w-full h-full p-2 sm:p-4 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {pendingUploads.map((upload: PendingUpload, index: number) => (
                      <div key={index} className="relative aspect-square group">
                        <Image
                          src={upload.imageUrl}
                          alt={upload.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                        {!isEditing && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const nextPending = pendingUploads.filter((_: PendingUpload, i: number) => i !== index)
                                const nextProgress = uploadProgress.filter((_: UploadProgress, i: number) => i !== index)
                                setPendingUploads(nextPending)
                                setUploadProgress(nextProgress)
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <span className="text-muted-foreground text-sm">
                    {isEditing ? 'Drag and drop new image or click to upload' : 'Drag and drop files here or click to upload'}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef as unknown as React.RefObject<HTMLInputElement>}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (isEditing) {
                        if (e.target.files?.[0]) {
                          handleMultipleFileUpload([e.target.files[0]])
                        }
                      } else {
                        if (e.target.files) {
                          handleMultipleFileUpload(Array.from(e.target.files))
                        }
                      }
                    }}
                    accept="image/*"
                    multiple={!isEditing}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => (fileInputRef.current as HTMLInputElement | null)?.click()}
                    disabled={isUploading}
                    className="px-6 py-3"
                  >
                    {isUploading ? 'Uploading...' : isEditing ? 'Select New Image' : 'Select Files'}
                  </Button>
                </div>
              )}
            </div>

            {uploadProgress.length > 0 && (
              <div className="space-y-2 max-h-[120px] sm:max-h-40 overflow-y-auto">
                {uploadProgress.map((item: UploadProgress, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.fileName}</div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${item.status === 'error' ? 'bg-destructive' : item.status === 'success' ? 'bg-green-500' : 'bg-primary'}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.status === 'error' ? 'Failed' : item.status === 'success' ? 'Complete' : `${item.progress}%`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingUploads.length > 0 && (
              <div className="space-y-2 max-h-[120px] sm:max-h-40 overflow-y-auto">
                {pendingUploads.map((upload: PendingUpload, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={upload.title}
                      onChange={(e) => {
                        const newUploads = [...pendingUploads]
                        newUploads[index].title = e.target.value
                        setPendingUploads(newUploads)
                      }}
                      className="h-10"
                      placeholder="Enter framework title"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isSubmitting || pendingUploads.length === 0}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}