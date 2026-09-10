"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={4000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              {variant === "destructive" ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              ) : variant === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sage-soft)]" />
              )}
              <div className="grid gap-0.5">
                {title && <ToastTitle className="text-sm font-extrabold tracking-wide text-white">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-xs font-medium text-white/90 leading-relaxed">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-white/70 hover:text-white" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}