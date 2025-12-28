import { OTPForm } from "@/components/otp-form"
import React from "react"

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default function OTPPage({ searchParams }: PageProps) {
  // For server component, we can't access auth context directly
  // So we rely on the email from query params
  const searchParamsValue = React.use(searchParams);
  const emailFromParams = searchParamsValue.email;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm email={emailFromParams} />
      </div>
    </div>
  )
}
