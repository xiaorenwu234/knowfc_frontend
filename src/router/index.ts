import { createRouter, createWebHistory } from 'vue-router'
import SignInView from "@/views/SignInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import ForgetPasswordView from "@/views/ForgetPasswordView.vue";
import MessageView from "@/views/MessageView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MessageView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: ForgetPasswordView,
    },
  ],
})

export default router
