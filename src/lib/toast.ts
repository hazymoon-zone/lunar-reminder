export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function showToast(options: ToastOptions): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<ToastOptions>("app:toast", {
      detail: {
        type: "info",
        duration: 4000,
        ...options,
      },
    }),
  );
}
