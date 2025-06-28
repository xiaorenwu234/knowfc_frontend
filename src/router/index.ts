import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: '/article-detail',
      name: 'article-detail',
      component: () => import('../views/ArticleDetailView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      children: [
        {
          path: 'works',
          name: 'search-works',
          component: () => import('../views/SearchWorkView.vue'),
        }, {
          path: 'users',
          name: 'search-users',
          component: () => import('../views/SearchUserView.vue'),
        }, {
          path: 'problems',
          name: 'search-problems',
          component: () => import('../views/SearchProblemView.vue'),
        }
      ]
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
    },
    {
      path: '/personal-notify/:id',
      name: 'personal-notify',
      component: () => import('../views/NotifiView.vue'),
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('../views/Project.vue'),
    },
    {
      path: '/upload-paper',
      name: 'upload-paper',
      component: () => import('../views/UploadPaperView.vue'),
    }
  ],
})

export default router
