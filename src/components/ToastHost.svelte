<script lang="ts">
  import { onMount } from "svelte";
  import type { ToastOptions, ToastType } from "../lib/toast.ts";

  type Toast = Required<ToastOptions> & { id: string };

  let toasts = $state<Toast[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const alertClasses: Record<ToastType, string> = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  function dismissToast(id: string) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    toasts = toasts.filter((toast) => toast.id !== id);
  }

  function addToast(event: Event) {
    const { detail } = event as CustomEvent<ToastOptions>;
    const toast: Toast = {
      id: crypto.randomUUID(),
      message: detail.message,
      type: detail.type ?? "info",
      duration: detail.duration ?? 4000,
    };

    toasts = [...toasts, toast];
    timers.set(toast.id, setTimeout(() => dismissToast(toast.id), toast.duration));
  }

  onMount(() => {
    window.addEventListener("app:toast", addToast);

    return () => {
      window.removeEventListener("app:toast", addToast);
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  });
</script>

<div class="toast toast-top toast-end z-[100]" aria-live="polite" aria-atomic="true">
  {#each toasts as toast (toast.id)}
    <div class={`alert ${alertClasses[toast.type]} shadow-lg`} role="status">
      <span>{toast.message}</span>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        aria-label="Dismiss notification"
        onclick={() => dismissToast(toast.id)}
      >
        &times;
      </button>
    </div>
  {/each}
</div>
