import { toast } from "vue3-toastify";

export const success = (message: string) => toast.success(message);
export const info = (message: string) => toast.info(message);
export const warn = (message: string) => toast.warn(message);
export const error = (message: string) => toast.error(message);
