import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/SignInView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: () => import('../views/ForgetPasswordView.vue'),
    },
    {
      path: '/article-detail/:id',
      name: 'article-detail',
      component: () => import('../views/ArticleDetailView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/MessageView.vue'),
    },
    {
      path: '/Individual/IndividualHistory',
      name: 'IndividualHistory',
      component: () => import('../views/IndividualHistoryView.vue'),
    },
    {
      path: '/personal-center/:id',
      name: 'personal-center',
      component: () => import('../views/PersonalCenterView.vue'),
    },
    {
      path: '/Problem',
      name: 'Problem',
      component: () => import('../views/ProblemView.vue'),
    }
  ],
})

export default router
