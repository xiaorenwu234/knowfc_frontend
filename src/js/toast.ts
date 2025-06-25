import MyToast from '@/components/MyToast.vue'
import { toast, type ToastType } from 'vue3-toastify'

export const notify = (type: ToastType, title: string, message: string) => {
  toast(MyToast, { type, contentProps: { title, message } })
}
