import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toasity, { toast } from 'vue3-toastify'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vue3-toastify/dist/index.css'
import './style.css'

import App from './App.vue'
import router from './router'
import { logout } from './js/User'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Vue3Toasity, {
  autoClose: 2000,
  closeButton: false,
  expandCustomProps: true,
  hideProgressBar: true,
  position: toast.POSITION.TOP_CENTER,
  theme: toast.THEME.COLORED,
  toastStyle: {
    borderRadius: '12px',
    minHeight: '36px',
  },
})

logout()

app.mount('#app')
