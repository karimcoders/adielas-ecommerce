import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Create account — ADIELAS Nutrition",
};

export default function RegisterPage() {
  return (
    <div className="bg-[var(--cream-page)] px-4 pb-24 pt-28 sm:pt-36">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
