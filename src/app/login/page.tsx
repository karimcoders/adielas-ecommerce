import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Log in — ADIELAS Nutrition",
};

export default function LoginPage() {
  return (
    <div className="bg-[var(--cream-page)] px-4 pb-24 pt-28 sm:pt-36">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
