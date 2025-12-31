//====================== Products ======================//
interface Products {
  _id: string;
  title: string;
  productsId: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  description: string;
  faqs: string;
  price: number;
  stock: number;
  sold?: number;
  download?: string;
  category: ProductsCategory[];
  rating?: number;
  views?: number;
  ratingCount?: number;
  images?: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: UserRole;
  };
  tags?: ProductsTags[];
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

interface Productsframeworks {
  title: string;
  frameworkId: string;
  thumbnail: string;
}

interface ProductsCategory {
  title: string;
  categoryId: string;
}

interface ProductsTags {
  title: string;
  tagsId: string;
}

interface ProductsReview {
  _id: string;
  productsId: string;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  title: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Framework {
  _id: string;
  title: string;
  frameworkId: string;
  thumbnail: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Tag {
  _id: string;
  title: string;
  tagsId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateFormData {
  title: string;
  productsId: string;
  thumbnail: string;
  description: string;
  faqs: string;
  price: number;
  stock: number;
  download?: string;
  category: string;
  frameworks: string[];
  tags: string[];
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  images: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
}

interface EditFormData {
  title: string;
  productsId: string;
  thumbnail: string;
  description: string;
  faqs: string;
  price: number;
  stock: number;
  download?: string;
  category: string;
  frameworks: string[];
  tags: string[];
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  images: string[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    until?: string;
  };
}

//====================== Category ======================//
interface Category {
  _id: string;
  title: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormDataState {
  title: string;
  categoryId: string;
}

type ProjectsCategoryProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProjectsCategoryProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingCategory: Category | null;
  formData: CategoryFormDataState;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormDataState>>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

//====================== Framework ======================//
interface Framework {
  _id: string;
  title: string;
  frameworkId: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface FrameworkFormDataState {
  title: string;
  frameworkId: string;
}

type ProjectsFrameworkProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProjectsFrameworkProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingFramework: Framework | null;
  formData: { title: string; frameworkId: string };
  setFormData: (v: { title: string; frameworkId: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};

// Define types for file upload functionality
interface PendingUpload {
  file: File;
  imageUrl: string;
  title: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

// Type for the form modal props
interface FormModalProjectsFrameworksProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEditing: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  pendingUploads: PendingUpload[];
  setPendingUploads: React.Dispatch<React.SetStateAction<PendingUpload[]>>;
  uploadProgress: UploadProgress[];
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress[]>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  isSubmitting: boolean;
  handleMultipleFileUpload: (files: File[]) => Promise<void>;
}

interface DeleteModalProjectsFrameworksProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

//====================== Tags ======================//
interface Tags {
  _id: string;
  title: string;
  tagsId: string;
  createdAt: string;
  updatedAt: string;
}

interface TagsFormDataState {
  title: string;
  tagsId: string;
}

type ProjectsTagsProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemTitle?: string;
};

type FormModalProjectsTagsProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingTags: Tags | null;
  formData: { title: string; tagsId: string };
  setFormData: (v: { title: string; tagsId: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};
