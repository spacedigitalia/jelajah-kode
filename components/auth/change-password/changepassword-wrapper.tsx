"use client";

import { Suspense } from "react";

import { ChangePasswordForm } from "./changepassword-form";

export function ChangePasswordWrapper() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ChangePasswordForm />
    </Suspense>
  );
}
