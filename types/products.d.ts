//====================== Products ======================//
interface Products {
  _id: string;
  title: string;
  thumbnail: string;
  frameworks: Productsframeworks[];
  description: string;
  faqs: string;
  price: number;
  stock: number;
  sold?: number;
  category: ProductsCategory[];
  rating?: number;
  views?: number;
  ratingCount?: number;
  reviews?: Productsreview[];
  images?: string[];
  tags?: string[];
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

interface Productsframeworks {
  title: string;
  frameworkId: string;
}

interface ProductsCategory {
  title: string;
  categoryId: string;
}

interface Productsreview {
  _id: string;
  name: string;
  date: string;
  picture: string;
  rating: number;
  comment: string;
}

//====================== Category ======================//
interface Category {
  _id: string;
  title: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataState {
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
  formData: { title: string; categoryId: string };
  setFormData: (v: { title: string; categoryId: string }) => void;
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

interface FormDataState {
  title: string;
  categoryId: string;
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
