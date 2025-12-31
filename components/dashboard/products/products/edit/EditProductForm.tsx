"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { useRouter } from "next/navigation";

import Image from "next/image";

import QuillEditor from "@/helper/editor/QuillEditor";

import { useStateEditProducts } from "@/components/dashboard/products/products/edit/lib/useStateEditProducts";

import { formatIDR } from "@/hooks/FormatPrice";

import FormSkelaton from "@/components/dashboard/products/products/FormSkelaton";

export default function EditProductForm() {
  const router = useRouter();
  const {
    categories,
    frameworks,
    tags,
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
    handleFileUpload,
    handleThumbnailUpload,
    handleChange,
    handlePriceChange,
    handleSubmit,
  } = useStateEditProducts();

  if (isPageLoading) {
    return <FormSkelaton />;
  }

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Product title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="productsId">Product ID *</Label>
                  <Input
                    id="productsId"
                    name="productsId"
                    value={formData.productsId}
                    onChange={handleChange}
                    required
                    placeholder="Unique product identifier"
                    readOnly
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    value={formatIDR(formData.price)}
                    onChange={handlePriceChange}
                    required
                    placeholder="0"
                    inputMode="numeric"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="download">Download URL</Label>
                  <Input
                    id="download"
                    name="download"
                    type="text"
                    value={formData.download || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/download"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="paymentType">Payment Type *</Label>
                  <Select
                    name="paymentType"
                    value={formData.paymentType}
                    onValueChange={(value: "free" | "paid") =>
                      setFormData((prev) => ({ ...prev, paymentType: value }))
                    }
                  >
                    <SelectTrigger id="paymentType" className="w-full">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value: "publish" | "draft") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="publish">Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="thumbnail">Thumbnail *</Label>
                  <div className="space-y-2">
                    {formData.thumbnail && (
                      <div className="relative w-full h-32 max-w-xs">
                        <Image
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, thumbnail: "" }))
                          }
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <span className="w-4 h-4 flex items-center justify-center">
                            ×
                          </span>
                        </button>
                      </div>
                    )}
                    <div className="relative w-full">
                      <Input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                        disabled={isThumbnailUploading}
                        className="w-full"
                      >
                        {isThumbnailUploading && formData.thumbnail
                          ? "Uploading new..."
                          : !formData.thumbnail
                            ? "Choose Thumbnail"
                            : "Change Thumbnail"}
                      </Button>
                      {thumbnailUploadProgress > 0 && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${thumbnailUploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images Upload Section */}
                <div className="border rounded-lg p-4 bg-muted">
                  <h3 className="font-medium mb-3">Product Images</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="w-4 h-4 flex items-center justify-center">
                              ×
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                          disabled={isImageUploading}
                          className="w-full"
                        >
                          {isImageUploading ? "Uploading..." : "Choose Image"}
                        </Button>
                        {uploadProgress > 0 && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description *</Label>
                <QuillEditor
                  value={formData.description}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, description: content }))
                  }
                  placeholder="Product description"
                  height="400px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="faqs">FAQs</Label>
                <QuillEditor
                  value={formData.faqs}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, faqs: content }))
                  }
                  placeholder="Frequently asked questions"
                  height="300px"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    value={formatIDR(formData.price)}
                    onChange={handlePriceChange}
                    required
                    placeholder="0"
                    inputMode="numeric"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="download">Download URL</Label>
                  <Input
                    id="download"
                    name="download"
                    type="text"
                    value={formData.download || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/download"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="paymentType">Payment Type *</Label>
                  <Select
                    name="paymentType"
                    value={formData.paymentType}
                    onValueChange={(value: "free" | "paid") =>
                      setFormData((prev) => ({ ...prev, paymentType: value }))
                    }
                  >
                    <SelectTrigger id="paymentType" className="w-full">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value: "publish" | "draft") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="publish">Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="framework">Framework</Label>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {frameworks.map((framework) => (
                      <div
                        key={framework.frameworkId}
                        className={`border rounded-md p-3 cursor-pointer transition-colors ${formData.frameworks.includes(framework.frameworkId)
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            frameworks: prev.frameworks.includes(
                              framework.frameworkId
                            )
                              ? prev.frameworks.filter(
                                (id) => id !== framework.frameworkId
                              )
                              : [...prev.frameworks, framework.frameworkId],
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border ${formData.frameworks.includes(
                              framework.frameworkId
                            )
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                              }`}
                          >
                            {formData.frameworks.includes(
                              framework.frameworkId
                            ) && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                              )}
                          </div>
                          {framework.thumbnail && (
                            <Image
                              src={framework.thumbnail}
                              alt={framework.title}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-contain rounded border"
                            />
                          )}
                          <span>{framework.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tags">Tags</Label>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag._id}
                        className={`border rounded-md p-3 cursor-pointer transition-colors ${formData.tags.includes(tag._id)
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.includes(tag._id)
                              ? prev.tags.filter((id) => id !== tag._id)
                              : [...prev.tags, tag._id],
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded border ${formData.tags.includes(tag._id)
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                              }`}
                          >
                            {formData.tags.includes(tag._id) && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {tag.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount Section */}
              <div className="border rounded-lg p-4 bg-muted">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Discount</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Enable discount
                    </span>
                    <input
                      type="checkbox"
                      checked={!!formData.discount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount: e.target.checked
                            ? {
                              type: "percentage",
                              value: 0,
                              until: "",
                            }
                            : undefined,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                {formData.discount && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="discountType">Type</Label>
                      <Select
                        name="discountType"
                        value={formData.discount.type}
                        onValueChange={(value: "percentage" | "fixed") =>
                          setFormData((prev) => ({
                            ...prev,
                            discount: {
                              type: value,
                              value: prev.discount ? prev.discount.value : 0,
                              until: prev.discount ? prev.discount.until : "",
                            },
                          }))
                        }
                      >
                        <SelectTrigger id="discountType">
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="discountValue">Value</Label>
                      <Input
                        id="discountValue"
                        type="number"
                        min="0"
                        value={formData.discount.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            discount: {
                              type: prev.discount
                                ? prev.discount.type
                                : "percentage",
                              value: Number(e.target.value),
                              until: prev.discount ? prev.discount.until : "",
                            },
                          }))
                        }
                        placeholder="Discount value"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountUntil">Until (Optional)</Label>
                      <Input
                        id="discountUntil"
                        type="date"
                        value={formData.discount.until || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            discount: {
                              type: prev.discount
                                ? prev.discount.type
                                : "percentage",
                              value: prev.discount ? prev.discount.value : 0,
                              until: e.target.value,
                            },
                          }))
                        }
                        placeholder="End date (YYYY-MM-DD)"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Author Information */}
            <div className="border rounded-lg p-4 bg-muted">
              <h3 className="font-medium mb-2">Author Information</h3>
              <div className="flex items-center gap-3">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                    <span className="text-foreground text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{user?.name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This product will be associated with your account.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
