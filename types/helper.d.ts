//=================== Form Signup ===================//
interface FormSignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

//=================== Email Config ===================//
interface EmailConfig {
  service?: string;
  auth: {
    user: string;
    pass: string;
  };
}

//=================== Bottom Sheet ===================//
interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
  responsive?: boolean;
}
